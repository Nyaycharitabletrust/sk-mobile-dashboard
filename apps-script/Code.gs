const USERS_SHEET = 'Users';
const SALES_SHEET = 'Sales';
const SESSION_TTL_SECONDS = 60 * 60 * 4;
const BRAND_COLUMNS = ['APPLE', 'SAMSUNG', 'MI', 'VIVO', 'OPPO', 'REALME', 'MOTOROLA', 'ONE PLUS', 'OTHERS', 'ACCESSORIES'];

function doPost(event) {
  try {
    const request = parseRequest_(event);

    if (request.action === 'login') {
      return json_(login_(request));
    }

    if (request.action === 'dashboard') {
      return json_(getDashboard_(request));
    }

    return json_({ ok: false, error: 'Unknown action.' });
  } catch (error) {
    return json_({ ok: false, error: error.message || 'Server error.' });
  }
}

function doGet() {
  return json_({ ok: true, message: 'Store dashboard API is running.' });
}

function login_(request) {
  const username = String(request.username || '').trim().toLowerCase();
  const password = String(request.password || '');

  if (!username || !password) {
    throw new Error('Username and password are required.');
  }

  const users = readSheetObjects_(USERS_SHEET);
  const user = users.find((row) => {
    const isActive = !row.Active || String(row.Active).toUpperCase() === 'TRUE';
    return String(row.Username || '').trim().toLowerCase() === username && isActive;
  });

  if (!user) {
    throw new Error('Invalid username or password.');
  }

  if (String(user.Password || '') !== password) {
    throw new Error('Invalid username or password.');
  }

  const token = Utilities.getUuid() + Utilities.getUuid();
  const session = {
    username,
    displayName: String(user.Username || username),
    storeId: String(user.Store || ''),
    storeName: String(user.Store || ''),
    role: String(user.Role || 'Store user'),
    access: isAdmin_(user) ? 'admin' : 'store'
  };

  CacheService.getScriptCache().put(sessionKey_(token), JSON.stringify(session), SESSION_TTL_SECONDS);

  return {
    ok: true,
    session: {
      token,
      displayName: session.displayName,
      expiresInSeconds: SESSION_TTL_SECONDS
    }
  };
}

function getDashboard_(request) {
  const token = String(request.token || '');
  const session = getSession_(token);

  if (!session) {
    throw new Error('Session expired. Please sign in again.');
  }

  const allRows = readSheetObjects_(SALES_SHEET);
  const salesRows = session.access === 'admin'
    ? allRows
    : allRows.filter((row) => String(row.Store || '').trim().toLowerCase() === String(session.storeId || '').trim().toLowerCase());

  if (!salesRows.length) {
    throw new Error('No sales data found for your assigned store.');
  }

  const stores = salesRows.map(toDashboardRow_);
  const dashboard = session.access === 'admin' ? makeAdminDashboard_(stores) : stores[0];

  return {
    ok: true,
    user: {
      displayName: session.displayName,
      role: session.role
    },
    dashboard
  };
}

function isAdmin_(user) {
  const role = String(user.Role || '').trim().toLowerCase();
  return role === 'admin' || role === 'senior';
}

function toDashboardRow_(row) {
  return {
    storeName: String(row.Store || ''),
    tgtQty: toNumber_(row['TGT QTY']),
    tgtValue: toNumber_(row['TGT VALUE']),
    achQty: toNumber_(row['ACH QTY']),
    achValue: toNumber_(row['ACH VALUE']),
    achValuePercent: toNumber_(row['ACH VALUE %']),
    eom: String(row.EOM || ''),
    toDoBalance: toNumber_(row['TO DO BLANCE']),
    drr: toNumber_(row.DRR),
    lmtd: toNumber_(row.LMTD),
    growth: toNumber_(row['GRTH%']),
    ftdQty: toNumber_(row['FTD QTY']),
    ftdValue: toNumber_(row['FTD VALUE']),
    brands: toBrandMap_(row)
  };
}

function makeAdminDashboard_(stores) {
  const totals = stores.reduce((summary, store) => {
    summary.tgtQty += store.tgtQty;
    summary.tgtValue += store.tgtValue;
    summary.achQty += store.achQty;
    summary.achValue += store.achValue;
    summary.toDoBalance += store.toDoBalance;
    summary.drr += store.drr;
    summary.lmtd += store.lmtd;
    summary.ftdQty += store.ftdQty;
    summary.ftdValue += store.ftdValue;
    BRAND_COLUMNS.forEach((brand) => {
      summary.brands[brand] += store.brands[brand] || 0;
    });
    return summary;
  }, {
    storeName: 'All Stores',
    tgtQty: 0,
    tgtValue: 0,
    achQty: 0,
    achValue: 0,
    toDoBalance: 0,
    drr: 0,
    lmtd: 0,
    ftdQty: 0,
    ftdValue: 0,
    brands: emptyBrandMap_()
  });

  totals.achValuePercent = totals.tgtValue > 0 ? (totals.achValue / totals.tgtValue) * 100 : 0;
  totals.growth = totals.lmtd > 0 ? ((totals.achValue - totals.lmtd) / totals.lmtd) * 100 : 0;
  totals.eom = stores[0] ? stores[0].eom : '';
  totals.stores = stores;
  return totals;
}

function toBrandMap_(row) {
  return BRAND_COLUMNS.reduce((brands, brand) => {
    brands[brand] = toNumber_(row[brand]);
    return brands;
  }, {});
}

function emptyBrandMap_() {
  return BRAND_COLUMNS.reduce((brands, brand) => {
    brands[brand] = 0;
    return brands;
  }, {});
}

function getSession_(token) {
  if (!token) {
    return null;
  }

  const cached = CacheService.getScriptCache().get(sessionKey_(token));
  return cached ? JSON.parse(cached) : null;
}

function sessionKey_(token) {
  return `session:${token}`;
}

function parseRequest_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    return {};
  }

  return JSON.parse(event.postData.contents);
}

function readSheetObjects_(sheetName) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('SPREADSHEET_ID script property is missing.');
  }

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" was not found.`);
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return [];
  }

  const headers = values[0].map((header) => String(header).trim());

  return values.slice(1).filter((row) => row.some((cell) => cell !== '')).map((row) => {
    return headers.reduce((record, header, index) => {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function parseMonth_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return value.getTime();
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function toNumber_(value) {
  const number = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
