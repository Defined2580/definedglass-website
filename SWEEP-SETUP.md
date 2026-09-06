# Gallery Sweep - Cloud Setup (one-time, ~10 minutes)

The Sunday 2AM photo sweep now runs in the cloud (GitHub Actions), not on your
PC. It reads the "New Pictures 2026" folder in the Public SharePoint site,
watermarks new photos, and updates the site. Your PC can be off.

## One-time setup

### 1. Create the app credential in Microsoft 365

1. Go to https://entra.microsoft.com and sign in with your Microsoft 365 admin account.
2. Left menu: **Identity > Applications > App registrations > New registration**.
   - Name: `Website Gallery Sync`
   - Supported account types: **Accounts in this organizational directory only**
   - Redirect URI: leave empty. Click **Register**.
3. On the app page, copy these two values from the **Overview** tab (you'll need them in step 3):
   - **Application (client) ID**
   - **Directory (tenant) ID**
4. Go to **API permissions > Add a permission > Microsoft Graph > Application permissions**.
   - Search for `Sites.Read.All`, check it, click **Add permissions**.
   - Click **Grant admin consent for Defined Glass** and confirm.
5. Go to **Certificates & secrets > New client secret**.
   - Description: `github-actions`, pick the longest expiry offered.
   - **Copy the secret VALUE immediately** - it's only shown once.

### 2. Hand the three values to Instinct

Send them over the vault link Instinct provides (never in plain chat):
- Tenant ID
- Client ID
- Client secret

Instinct stores them as encrypted repo secrets (`MS_TENANT_ID`, `MS_CLIENT_ID`,
`MS_CLIENT_SECRET`) that only the workflow can read.

### 3. Done

The sweep runs every Sunday at ~2AM and can also be run manually:
repo > **Actions** tab > **Gallery sync** > **Run workflow**.

## Behavior notes

- **Add-only by default**: photos you delete from SharePoint stay on the site.
  To let the sweep also remove site photos, set repo variable `ALLOW_DELETE` to
  `true` (repo > Settings > Secrets and variables > Actions > Variables tab).
- **Dry-run mode**: set repo variable `DRY_RUN` to `true` to log what would
  change without touching the site.
- Newest photos get the highest numbers and appear first in the gallery.
- The old Windows Task Scheduler task (`sync-gallery.ps1`) is no longer needed -
  disable or delete it in Task Scheduler so the two never fight.

## If SharePoint details differ

The workflow assumes site `definedglass.sharepoint.com/sites/Public`, library
`Documents`, folder `New Pictures 2026`. If your site path is different, set
repo variables `SHAREPOINT_HOST` and/or `SHAREPOINT_SITE_PATH` to override.
