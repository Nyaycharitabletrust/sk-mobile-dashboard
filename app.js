const API_URL = 'https://script.google.com/macros/s/AKfycbwgsfURccD4hxMGcriec0seV9yUFuENGwO4lvRt0iXXidsMyArOEQW-7E2PT507OiA_/exec';
const SESSION_KEY = 'store_dashboard_session';

const loginView = document.querySelector('#loginView');
const dashboardView = document.querySelector('#dashboardView');
const loginForm = document.querySelector('#loginForm');
const loginButton = document.querySelector('#loginButton');
const demoButton = document.querySelector('#demoButton');
const loginMessage = document.querySelector('#loginMessage');
const dashboardMessage = document.querySelector('#dashboardMessage');
const logoutButton = document.querySelector('#logoutButton');
const adminPanel = document.querySelector('#adminPanel');
const adminRows = document.querySelector('#adminRows');
const brandGrid = document.querySelector('#brandGrid');
const seniorControls = document.querySelector('#seniorControls');
const storeFilter = document.querySelector('#storeFilter');

const brands = ['APPLE', 'SAMSUNG', 'MI', 'VIVO', 'OPPO', 'REALME', 'MOTOROLA', 'ONE PLUS', 'OTHERS', 'ACCESSORIES'];
const cafeStores = new Set(['INC', 'BHC', 'OPC']);
const standaloneStores = new Set(['VIVO']);
const brandSumFields = ['tgtQty', 'tgtValue', 'achQty', 'achValue', 'eom', 'toDoBalance', 'drr', 'lmtd', 'ftdQty', 'ftdValue'];
let latestDashboard = null;
let latestUser = null;

const demoUsers = {
  'kunj11': {
    password: 'sk@001',
    displayName: 'KUNJ11',
    role: 'Store Manager',
    storeId: 'KUNJ',
    storeName: 'KUNJ'
  },
  'k1011': {
    password: 'sk@002',
    displayName: 'K1011',
    role: 'Store Manager',
    storeId: 'K10',
    storeName: 'K10'
  },
  'nsk11': {
    password: 'sk@003',
    displayName: 'NSK11',
    role: 'Store Manager',
    storeId: 'NSK',
    storeName: 'NSK'
  },
  'kbg11': {
    password: 'sk@004',
    displayName: 'KBG11',
    role: 'Store Manager',
    storeId: 'KBG',
    storeName: 'KBG'
  },
  'raj11': {
    password: 'sk@005',
    displayName: 'RAJ11',
    role: 'Store Manager',
    storeId: 'RAJ',
    storeName: 'RAJ'
  },
  'wag11': {
    password: 'sk@006',
    displayName: 'WAG11',
    role: 'Store Manager',
    storeId: 'WGH',
    storeName: 'WGH'
  },
  'vivo11': {
    password: 'sk@007',
    displayName: 'VIVO11',
    role: 'Store Manager',
    storeId: 'VIVO',
    storeName: 'VIVO'
  },
  'opc11': {
    password: 'sk@008',
    displayName: 'OPC11',
    role: 'Store Manager',
    storeId: 'OPC',
    storeName: 'OPC'
  },
  'opm11': {
    password: 'sk@009',
    displayName: 'OPM11',
    role: 'Store Manager',
    storeId: 'OPM',
    storeName: 'OPM'
  },
  'alm11': {
    password: 'sk@010',
    displayName: 'ALM11',
    role: 'Store Manager',
    storeId: 'ALM',
    storeName: 'ALM'
  },
  'inc11': {
    password: 'sk@011',
    displayName: 'INC11',
    role: 'Store Manager',
    storeId: 'INC',
    storeName: 'INC'
  },
  'bhc11': {
    password: 'sk@012',
    displayName: 'BHC11',
    role: 'Store Manager',
    storeId: 'BHC',
    storeName: 'BHC'
  },
  'parth11': {
    password: 'sk@100',
    displayName: 'Parth11',
    role: 'Senior',
    access: 'admin'
  },
  'cmd11': {
    password: 'sk@101',
    displayName: 'CMD11',
    role: 'Senior',
    access: 'admin'
  },
  'srinivas11': {
    password: 'sk@102',
    displayName: 'Srinivas11',
    role: 'Senior',
    access: 'admin'
  },
  'vijay11': {
    password: 'sk@103',
    displayName: 'Vijay11',
    role: 'Senior',
    access: 'admin'
  },
  'nilesh11': {
    password: 'sk@104',
    displayName: 'nilesh11',
    role: 'Senior',
    access: 'admin'
  },
  'amit11': {
    password: 'sk@105',
    displayName: 'amit11',
    role: 'Senior',
    access: 'admin'
  },
  'milind11': {
    password: 'sk@106',
    displayName: 'Milind11',
    role: 'Senior',
    access: 'admin'
  },
  'bhadresh11': {
    password: 'sk@107',
    displayName: 'Bhadresh11',
    role: 'Senior',
    access: 'admin'
  }
};

const demoSales = {
  KUNJ: makeDemoDashboard('KUNJ', 110, 2200000, 78, 1650000, 75, 550000, 86000, 1420000, 16, 8, 176000, [6, 14, 9, 11, 8, 5, 4, 3, 2, 16]),
  K10: makeDemoDashboard('K10', 95, 1900000, 62, 1280000, 67.4, 620000, 72000, 1190000, 7.6, 5, 108000, [4, 12, 7, 10, 6, 4, 3, 2, 1, 13]),
  NSK: makeDemoDashboard('NSK', 105, 2100000, 84, 1785000, 85, 315000, 61000, 1610000, 10.9, 7, 151000, [7, 16, 10, 12, 9, 6, 5, 4, 2, 13]),
  KBG: makeDemoDashboard('KBG', 120, 2400000, 91, 1960000, 81.7, 440000, 80000, 1790000, 9.5, 9, 188000, [8, 18, 11, 13, 10, 7, 5, 4, 3, 12]),
  RAJ: makeDemoDashboard('RAJ', 75, 1500000, 48, 930000, 62, 570000, 69000, 870000, 6.9, 4, 82000, [3, 9, 6, 8, 5, 4, 3, 1, 1, 8]),
  WGH: makeDemoDashboard('WGH', 88, 1760000, 59, 1215000, 69, 545000, 71000, 1130000, 7.5, 5, 99000, [4, 11, 7, 9, 6, 5, 3, 2, 2, 10]),
  VIVO: makeDemoDashboard('VIVO', 70, 1400000, 52, 1090000, 77.9, 310000, 56000, 980000, 11.2, 4, 84000, [3, 8, 5, 12, 6, 4, 2, 1, 1, 10]),
  OPC: makeDemoDashboard('OPC', 115, 2300000, 86, 1815000, 78.9, 485000, 76000, 1690000, 7.4, 8, 174000, [8, 17, 10, 12, 9, 6, 5, 4, 2, 13]),
  OPM: makeDemoDashboard('OPM', 100, 2000000, 72, 1525000, 76.3, 475000, 68000, 1430000, 6.6, 6, 128000, [6, 15, 9, 10, 8, 5, 4, 3, 2, 10]),
  ALM: makeDemoDashboard('ALM', 92, 1840000, 74, 1580000, 85.9, 260000, 52000, 1460000, 8.2, 6, 121000, [7, 14, 8, 11, 7, 5, 4, 3, 2, 13]),
  INC: makeDemoDashboard('INC', 130, 2600000, 96, 2140000, 82.3, 460000, 84000, 1975000, 8.4, 10, 206000, [9, 19, 12, 14, 11, 7, 6, 5, 3, 10]),
  BHC: makeDemoDashboard('BHC', 80, 1600000, 57, 1180000, 73.8, 420000, 60000, 1090000, 8.3, 5, 102000, [4, 10, 7, 8, 6, 4, 3, 2, 1, 12])
};

const fields = {
  userName: document.querySelector('#userName'),
  userRole: document.querySelector('#userRole'),
  storeName: document.querySelector('#storeName'),
  eomLabel: document.querySelector('#eomLabel'),
  tgtQty: document.querySelector('#tgtQty'),
  tgtValue: document.querySelector('#tgtValue'),
  achQty: document.querySelector('#achQty'),
  achValue: document.querySelector('#achValue'),
  achValuePercent: document.querySelector('#achValuePercent'),
  eom: document.querySelector('#eom'),
  toDoBalance: document.querySelector('#toDoBalance'),
  drr: document.querySelector('#drr'),
  lmtd: document.querySelector('#lmtd'),
  growth: document.querySelector('#growth'),
  ftdQty: document.querySelector('#ftdQty'),
  ftdValue: document.querySelector('#ftdValue'),
  achievementRing: document.querySelector('#achievementRing'),
  progressBar: document.querySelector('#progressBar')
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.textContent = '';
  loginButton.disabled = true;
  loginButton.textContent = 'Signing in...';

  const formData = new FormData(loginForm);
  const username = String(formData.get('username')).trim();
  const password = String(formData.get('password'));

  try {
    const response = await apiRequest('login', { username, password });
    saveSession(response.session);
    await loadDashboard();
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Sign in';
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
});

if (demoButton) {
  demoButton.addEventListener('click', () => {
    document.querySelector('#username').value = 'KUNJ11';
    document.querySelector('#password').value = 'sk@001';
    loginForm.requestSubmit();
  });
}

storeFilter.addEventListener('change', () => {
  if (!latestDashboard?.stores?.length || !latestUser) {
    return;
  }

  if (storeFilter.value === '__all__') {
    renderSelectedDashboard(latestUser, getAggregateDashboard('all'));
    return;
  }

  if (storeFilter.value === '__mbo__') {
    renderSelectedDashboard(latestUser, getAggregateDashboard('mbo'));
    return;
  }

  if (storeFilter.value === '__cafe__') {
    renderSelectedDashboard(latestUser, getAggregateDashboard('cafe'));
    return;
  }

  const selectedStore = latestDashboard.stores[Number(storeFilter.value)];
  if (selectedStore) {
    renderSelectedDashboard(latestUser, { ...selectedStore });
  }
});

window.addEventListener('load', () => {
  const session = getSession();
  if (session?.token) {
    loadDashboard().catch(() => showLogin());
  }
});

async function loadDashboard() {
  dashboardMessage.textContent = '';
  const session = getSession();
  if (!session?.token) {
    showLogin();
    return;
  }

  const response = await apiRequest('dashboard', { token: session.token });
  renderDashboard(response.user, response.dashboard);
  showDashboard();
}

function renderDashboard(user, dashboard) {
  latestUser = user;
  latestDashboard = dashboard;
  setupSeniorControls(dashboard);
  renderSelectedDashboard(user, dashboard);
}

function renderSelectedDashboard(user, dashboard) {
  const achievement = Number(dashboard.achValuePercent || 0);
  const clampedAchievement = Math.max(0, Math.min(achievement, 100));

  fields.userName.textContent = user.displayName;
  fields.userRole.textContent = user.role || 'Store user';
  fields.storeName.textContent = dashboard.storeName;
  fields.eomLabel.textContent = `EOM: ${formatNumber(dashboard.eom)}`;
  fields.tgtQty.textContent = formatNumber(dashboard.tgtQty);
  fields.tgtValue.textContent = formatCurrency(dashboard.tgtValue);
  fields.achQty.textContent = formatNumber(dashboard.achQty);
  fields.achValue.textContent = formatCurrency(dashboard.achValue);
  fields.achValuePercent.textContent = `${achievement.toFixed(1)}%`;
  fields.eom.textContent = formatNumber(dashboard.eom);
  fields.toDoBalance.textContent = formatCurrency(dashboard.toDoBalance);
  fields.drr.textContent = formatCurrency(dashboard.drr);
  fields.lmtd.textContent = formatCurrency(dashboard.lmtd);
  fields.growth.textContent = `${Number(dashboard.growth || 0).toFixed(1)}%`;
  setTrendClass(fields.growth, dashboard.growth);
  fields.ftdQty.textContent = formatNumber(dashboard.ftdQty);
  fields.ftdValue.textContent = formatCurrency(dashboard.ftdValue);
  fields.achievementRing.textContent = `${achievement.toFixed(0)}%`;
  fields.achievementRing.parentElement.style.setProperty('--score', `${clampedAchievement}%`);
  fields.progressBar.style.width = `${clampedAchievement}%`;

  renderBrandSales(dashboard.brandRows || makeBrandRowsFromMap(dashboard.brands || {}));
  renderAdminRows(dashboard.stores || []);
}

function setupSeniorControls(dashboard) {
  if (!dashboard.stores?.length) {
    seniorControls.classList.add('is-hidden');
    storeFilter.innerHTML = '<option value="__all__">All Stores</option>';
    return;
  }

  seniorControls.classList.remove('is-hidden');
  storeFilter.innerHTML = [
    '<option value="__all__">All Stores</option>',
    '<option value="__mbo__">All MBO Stores</option>',
    '<option value="__cafe__">All CAFE Stores</option>',
    ...dashboard.stores.map((store, index) => {
      return `<option value="${index}">${escapeHtml(store.storeName)}</option>`;
    })
  ].join('');
  storeFilter.value = '__all__';
}

async function apiRequest(action, payload) {
  if (!API_URL || API_URL.includes('PASTE_YOUR')) {
    return demoApiRequest(action, payload);
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({ action, ...payload })
  });

  if (!response.ok) {
    throw new Error('Unable to reach the dashboard service.');
  }

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

async function demoApiRequest(action, payload) {
  await new Promise((resolve) => setTimeout(resolve, 320));

  if (action === 'login') {
    const username = String(payload.username || '').trim().toLowerCase();
    const user = demoUsers[username];

    if (!user || user.password !== payload.password) {
      throw new Error('Invalid username or password.');
    }

    return {
      ok: true,
      session: {
        token: `demo:${username}`,
        displayName: user.displayName,
        expiresInSeconds: 14400
      }
    };
  }

  if (action === 'dashboard') {
    const username = String(payload.token || '').replace('demo:', '');
    const user = demoUsers[username];

    if (!user) {
      throw new Error('Session expired. Please sign in again.');
    }

    const dashboard = user.access === 'admin'
      ? makeAdminDashboard(Object.values(demoSales))
      : { ...demoSales[user.storeId] };

    return {
      ok: true,
      user: {
        displayName: user.displayName,
        role: user.role
      },
      dashboard
    };
  }

  throw new Error('Unknown action.');
}

function makeDemoDashboard(storeName, tgtQty, tgtValue, achQty, achValue, achValuePercent, toDoBalance, drr, lmtd, growth, ftdQty, ftdValue, brandValues) {
  return {
    storeName,
    tgtQty,
    tgtValue,
    achQty,
    achValue,
    achValuePercent,
    eom: 'June 2026',
    toDoBalance,
    drr,
    lmtd,
    growth,
    ftdQty,
    ftdValue,
    brands: makeBrandMap(brandValues),
    brandRows: makeDemoBrandRows(brandValues, tgtValue, achValue, lmtd, ftdQty, ftdValue)
  };
}

function makeAdminDashboard(stores, storeName = 'All Stores') {
  const totals = stores.reduce((summary, store) => {
    summary.tgtQty += Number(store.tgtQty || 0);
    summary.tgtValue += Number(store.tgtValue || 0);
    summary.achQty += Number(store.achQty || 0);
    summary.achValue += Number(store.achValue || 0);
    summary.toDoBalance += Number(store.toDoBalance || 0);
    summary.drr += Number(store.drr || 0);
    summary.lmtd += Number(store.lmtd || 0);
    summary.ftdQty += Number(store.ftdQty || 0);
    summary.ftdValue += Number(store.ftdValue || 0);
    brands.forEach((brand) => {
      summary.brands[brand] += Number(store.brands?.[brand] || 0);
    });
    summary.brandRows = aggregateBrandRows(summary.brandRows, store.brandRows || makeBrandRowsFromMap(store.brands || {}));
    return summary;
  }, {
    storeName,
    tgtQty: 0,
    tgtValue: 0,
    achQty: 0,
    achValue: 0,
    toDoBalance: 0,
    drr: 0,
    lmtd: 0,
    ftdQty: 0,
    ftdValue: 0,
    brands: makeBrandMap(),
    brandRows: makeEmptyBrandRows()
  });

  totals.achValuePercent = totals.tgtValue > 0 ? (totals.achValue / totals.tgtValue) * 100 : 0;
  totals.growth = totals.lmtd > 0 ? ((totals.achValue - totals.lmtd) / totals.lmtd) * 100 : 0;
  totals.brandRows = totals.brandRows.map(recalculateBrandPercentages);
  totals.eom = stores[0]?.eom || '-';
  totals.stores = stores;
  return totals;
}

function getStoresByType(type) {
  if (!latestDashboard?.stores?.length) {
    return [];
  }

  return latestDashboard.stores.filter((store) => {
    const storeName = String(store.storeName || '').trim().toUpperCase();
    const isCafe = cafeStores.has(storeName);
    const isStandalone = standaloneStores.has(storeName);
    return type === 'cafe' ? isCafe : !isCafe && !isStandalone;
  });
}

function getAggregateDashboard(type) {
  const aggregate = latestDashboard?.aggregates?.[type];
  if (aggregate) {
    return {
      ...aggregate,
      stores: type === 'all' ? latestDashboard.stores : []
    };
  }

  if (type === 'mbo') {
    return makeAdminDashboard(getStoresByType('mbo'), 'All MBO Stores');
  }

  if (type === 'cafe') {
    return makeAdminDashboard(getStoresByType('cafe'), 'All CAFE Stores');
  }

  return makeAdminDashboard(latestDashboard.stores || []);
}

function renderAdminRows(stores) {
  if (!stores.length) {
    adminPanel.classList.add('is-hidden');
    adminRows.innerHTML = '';
    return;
  }

  adminPanel.classList.remove('is-hidden');
  adminRows.innerHTML = stores.map((store) => {
    return `
      <tr>
        <td>${escapeHtml(store.storeName)}</td>
        <td>${formatNumber(store.tgtQty)}</td>
        <td>${formatCurrency(store.tgtValue)}</td>
        <td>${formatNumber(store.ftdQty)}</td>
        <td>${formatCurrency(store.ftdValue)}</td>
        <td>${formatNumber(store.achQty)}</td>
        <td>${formatCurrency(store.achValue)}</td>
        <td>${Number(store.achValuePercent || 0).toFixed(1)}%</td>
        <td>${formatNumber(store.eom)}</td>
        <td>${formatCurrency(store.toDoBalance)}</td>
        <td>${formatCurrency(store.drr)}</td>
        <td>${formatCurrency(store.lmtd)}</td>
        <td class="${getTrendClass(store.growth)}">${Number(store.growth || 0).toFixed(1)}%</td>
        ${brands.map((brand) => `<td>${formatNumber(store.brands?.[brand])}</td>`).join('')}
      </tr>
    `;
  }).join('');
}

function renderBrandSales(brandRows) {
  const rows = normalizeBrandRows(brandRows);
  brandGrid.innerHTML = `
    <div class="table-wrap">
      <table class="brand-table">
        <thead>
          <tr>
            <th>Brand</th>
            <th>TGT QTY</th>
            <th>TGT VALUE</th>
            <th>FTD QTY</th>
            <th>FTD VALUE</th>
            <th>ACH QTY(MTD)</th>
            <th>ACH VALUE(MTD)</th>
            <th>ACH VALUE %</th>
            <th>EOM</th>
            <th>TO DO BLANCE</th>
            <th>DRR</th>
            <th>LMTD</th>
            <th>GRTH%</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(row.brand)}</td>
              <td>${formatNumber(row.tgtQty)}</td>
              <td>${formatCurrency(row.tgtValue)}</td>
              <td>${formatNumber(row.ftdQty)}</td>
              <td>${formatCurrency(row.ftdValue)}</td>
              <td>${formatNumber(row.achQty)}</td>
              <td>${formatCurrency(row.achValue)}</td>
              <td>${Number(row.achValuePercent || 0).toFixed(1)}%</td>
              <td>${formatCurrency(row.eom)}</td>
              <td>${formatCurrency(row.toDoBalance)}</td>
              <td>${formatCurrency(row.drr)}</td>
              <td>${formatCurrency(row.lmtd)}</td>
              <td class="${getTrendClass(row.growth)}">${Number(row.growth || 0).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function makeBrandMap(values = []) {
  return brands.reduce((record, brand, index) => {
    record[brand] = Number(values[index] || 0);
    return record;
  }, {});
}

function makeEmptyBrandRows() {
  return brands.map((brand) => ({
    brand,
    tgtQty: 0,
    tgtValue: 0,
    achQty: 0,
    achValue: 0,
    achValuePercent: 0,
    eom: 0,
    toDoBalance: 0,
    drr: 0,
    lmtd: 0,
    growth: 0,
    ftdQty: 0,
    ftdValue: 0
  }));
}

function makeBrandRowsFromMap(brandSales = {}) {
  return brands.map((brand) => ({
    brand,
    tgtQty: 0,
    tgtValue: 0,
    achQty: Number(brandSales[brand] || 0),
    achValue: 0,
    achValuePercent: 0,
    eom: 0,
    toDoBalance: 0,
    drr: 0,
    lmtd: 0,
    growth: 0,
    ftdQty: 0,
    ftdValue: 0
  }));
}

function makeDemoBrandRows(brandValues = [], tgtValue = 0, achValue = 0, lmtd = 0, ftdQty = 0, ftdValue = 0) {
  const totalBrandQty = brandValues.reduce((total, value) => total + Number(value || 0), 0);
  return brands.map((brand, index) => {
    const achQty = Number(brandValues[index] || 0);
    const share = totalBrandQty > 0 ? achQty / totalBrandQty : 0;
    const brandTgtValue = Math.round(Number(tgtValue || 0) * share);
    const brandAchValue = Math.round(Number(achValue || 0) * share);
    const brandLmtd = Math.round(Number(lmtd || 0) * share);
    return recalculateBrandPercentages({
      brand,
      tgtQty: Math.round(totalBrandQty * share * 1.25),
      tgtValue: brandTgtValue,
      achQty,
      achValue: brandAchValue,
      achValuePercent: 0,
      eom: brandAchValue,
      toDoBalance: Math.max(brandTgtValue - brandAchValue, 0),
      drr: 0,
      lmtd: brandLmtd,
      growth: 0,
      ftdQty: Math.round(Number(ftdQty || 0) * share),
      ftdValue: Math.round(Number(ftdValue || 0) * share)
    });
  });
}

function aggregateBrandRows(summaryRows, storeRows) {
  const rowsByBrand = normalizeBrandRows(storeRows).reduce((record, row) => {
    record[String(row.brand || '').toUpperCase()] = row;
    return record;
  }, {});

  return summaryRows.map((summaryRow) => {
    const storeRow = rowsByBrand[String(summaryRow.brand || '').toUpperCase()];
    if (!storeRow) {
      return summaryRow;
    }

    brandSumFields.forEach((field) => {
      summaryRow[field] += Number(storeRow[field] || 0);
    });
    return summaryRow;
  });
}

function normalizeBrandRows(rows = []) {
  const rowsByBrand = rows.reduce((record, row) => {
    record[String(row.brand || '').toUpperCase()] = row;
    return record;
  }, {});

  return brands.map((brand) => {
    const row = rowsByBrand[brand] || {};
    return {
      brand,
      tgtQty: Number(row.tgtQty || 0),
      tgtValue: Number(row.tgtValue || 0),
      achQty: Number(row.achQty || 0),
      achValue: Number(row.achValue || 0),
      achValuePercent: Number(row.achValuePercent || 0),
      eom: Number(row.eom || 0),
      toDoBalance: Number(row.toDoBalance || 0),
      drr: Number(row.drr || 0),
      lmtd: Number(row.lmtd || 0),
      growth: Number(row.growth || 0),
      ftdQty: Number(row.ftdQty || 0),
      ftdValue: Number(row.ftdValue || 0)
    };
  });
}

function recalculateBrandPercentages(row) {
  row.achValuePercent = row.tgtValue > 0 ? (row.achValue / row.tgtValue) * 100 : 0;
  row.growth = row.lmtd > 0 ? ((row.achValue - row.lmtd) / row.lmtd) * 100 : 0;
  return row;
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function showDashboard() {
  loginView.classList.add('is-hidden');
  dashboardView.classList.remove('is-hidden');
}

function showLogin() {
  dashboardView.classList.add('is-hidden');
  loginView.classList.remove('is-hidden');
  adminPanel.classList.add('is-hidden');
  seniorControls.classList.add('is-hidden');
  latestDashboard = null;
  latestUser = null;
  loginForm.reset();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-IN');
}

function formatValue(value) {
  return value === undefined || value === null || value === '' ? '-' : String(value);
}

function getTrendClass(value) {
  const number = Number(value || 0);
  if (number > 0) {
    return 'trend-positive';
  }

  if (number < 0) {
    return 'trend-negative';
  }

  return 'trend-neutral';
}

function setTrendClass(element, value) {
  element.classList.remove('trend-positive', 'trend-negative', 'trend-neutral');
  element.classList.add(getTrendClass(value));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[character];
  });
}
