# Internal Company Dashboard

Modern mobile-responsive SK Mobile store performance dashboard built with HTML, CSS, vanilla JavaScript, and a Google Apps Script backend.

The frontend can be hosted on GitHub Pages. Google Sheets stores users and sales data, while Apps Script handles authentication and store-level access control.

## Project Structure

```text
internal-company-dashboard/
  index.html
  styles.css
  app.js
  apps-script/
    Code.gs
  sample-data/
    Users.csv
    Sales.csv
  README.md
```

## Security Model

- Users log in with username and password.
- Passwords are verified in Google Apps Script from the private `Users` sheet.
- The browser never receives the full user table or sales table.
- After login, Apps Script creates a short-lived session token.
- Dashboard data is always filtered on the backend using the authenticated user's assigned `StoreId`.
- The frontend cannot request another store's data.

## Google Sheet Setup

Create one Google Spreadsheet with two sheets named exactly:

```text
Users
Sales
```

### Users Sheet Columns

```text
Username,Password,Store,Role
```

Use `Role` as `Store user` for store-level logins and `Senior` for users who can see every store.

Example rows are available in `sample-data/Users.csv`.

### Sales Sheet Columns

```text
Store,TGT QTY,TGT VALUE,ACH QTY,ACH VALUE,ACH VALUE %,EOM,TO DO BLANCE,DRR,LMTD,GRTH%,FTD QTY,FTD VALUE,APPLE,SAMSUNG,MI,VIVO,OPPO,REALME,MOTOROLA,ONE PLUS,OTHERS,ACCESSORIES
```

Example rows are available in `sample-data/Sales.csv`.

Brand columns should contain sold quantity for each brand.

## Apps Script Setup

1. Create a Google Sheet and add the `Users` and `Sales` tabs.
2. Go to **Extensions > Apps Script**.
3. Paste the contents of `apps-script/Code.gs`.
4. Set this script property:

```text
SPREADSHEET_ID = your_google_spreadsheet_id
```

To set it:

1. In Apps Script, open **Project Settings**.
2. Add a script property named `SPREADSHEET_ID`.
3. Use the ID from your Google Sheet URL.

Example Sheet URL:

```text
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

## Deploy Apps Script

1. Click **Deploy > New deployment**.
2. Select **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone** or **Anyone with the link**.
5. Deploy.
6. Copy the Web App URL ending in `/exec`.

## Configure Frontend

Open `app.js` and replace:

```javascript
const API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

with your Apps Script Web App URL.

## Run Locally

Because this is static HTML, you can open `index.html` directly. For a local web server:

```bash
python -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. Go to **Settings > Pages**.
4. Source: deploy from branch.
5. Branch: `main`, folder `/root`.
6. Save and open the provided GitHub Pages URL.

## Demo Login Flow

The website works immediately in demo mode while `API_URL` is still set to:

```javascript
const API_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Use:

```text
Username: manager.mumbai
Password: demo123
```

Current SK Mobile demo users:

```text
Username: KUNJ11
Password: sk@001
Store: KUNJ
```

You can also use the other usernames/passwords from `sample-data/Users.csv`.

After you add real users in the `Users` sheet and update `API_URL`:

1. Open the dashboard.
2. Enter a username and password.
3. Apps Script validates the user.
4. The dashboard loads only that user's assigned store metrics.

Senior users such as `Parth11`, `CMD11`, and `Srinivas11` can see all store rows in the senior view.

## Production Notes

- Use HTTPS Apps Script deployment URLs only.
- Keep the spreadsheet private; only the Apps Script owner needs access.
- Rotate the Apps Script deployment if a URL is exposed accidentally.
- Keep session durations short by adjusting `SESSION_TTL_SECONDS` in `Code.gs`.
- For higher-security environments, use Google Workspace SSO instead of password-based login.
