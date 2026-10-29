# Weekly SEO and traffic report setup

The report uses a Google service account to read Search Console and GA4. It runs locally with Node.js 20 or later and requires no additional npm dependencies. It does not change either property.

## 1. Create a Google Cloud project

Open [Google Cloud Console](https://console.cloud.google.com/). Use the project selector, choose **New project**, give it a name, and create it. Select that project before continuing. An existing project is also suitable if you can manage its APIs and service accounts.

## 2. Enable both APIs

In **APIs & Services → Library**, find and enable each of these for the selected project:

- **Google Search Console API**
- **Google Analytics Data API**

Google's references describe the [Search Analytics query endpoint](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) and [GA4 Data API setup](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart).

## 3. Create a service account and JSON key

In **IAM & Admin → Service Accounts**, choose **Create service account**, enter a name, and finish creation. Project-wide IAM roles are not needed to read these analytics properties; access is granted separately in steps 4 and 5.

Open the service account, select **Keys → Add key → Create new key → JSON**, and download the key. If your organization prohibits key creation, ask its Google Cloud administrator to provide an approved service account/key arrangement.

Move the downloaded file to a private directory **outside this repository**, such as a `private/analytics` directory in your home directory. Restrict access to your account (`chmod 600` on the key file on macOS/Linux). Never commit, paste, print, or share the key contents. Obtain the service-account email from the account's **Details** tab in Cloud Console.

The script signs an RS256 JWT with Node's built-in crypto module and exchanges it at Google's token endpoint. Its scopes are `https://www.googleapis.com/auth/webmasters.readonly` and `https://www.googleapis.com/auth/analytics.readonly`. See Google's [service-account authentication reference](https://developers.google.com/identity/protocols/oauth2/service-account).

## 4. Grant access in Search Console

As an owner, open [Google Search Console](https://search.google.com/search-console), select the URL-prefix property **https://hoahwa.com/**, and go to **Settings → Users and permissions → Add user**. Enter the service-account email and choose **Restricted**; this is sufficient for Search Analytics reads.

The property must match the URL passed to the script, including `https://` and the trailing slash. Granting access to a different property does not grant access to this one. See [Search Console permissions](https://support.google.com/webmasters/answer/7687615).

## 5. Grant access in GA4 and find the property ID

In [Google Analytics](https://analytics.google.com/), select the intended GA4 property. In **Admin → Property access management**, add the service-account email with the **Viewer** role.

Find the numeric **Property ID** under **Admin → Property details** (in some layouts, under **Property settings → Property details**). Use that number for `GA4_PROPERTY_ID`; a measurement ID beginning with `G-` is not a property ID. See [GA4 access management](https://support.google.com/analytics/answer/9305587).

## 6. Export the environment variables

Set these in the shell that will run the command, replacing the placeholders locally:

```sh
export GOOGLE_APPLICATION_CREDENTIALS='/absolute/path/outside/repo/service-account.json'
export GA4_PROPERTY_ID='YOUR_NUMERIC_PROPERTY_ID'
export GSC_SITE_URL='https://hoahwa.com/'
```

`GOOGLE_APPLICATION_CREDENTIALS` is a file path, never the JSON contents. `GSC_SITE_URL` is optional and defaults to `https://hoahwa.com/`. The script reads the process environment and does **not** automatically load `.env` files. A scheduler must receive these variables in its own environment as well.

## 7. Run and interpret the report

From the repository root:

```sh
npm run report:weekly
```

The command prints Markdown and writes JSON to `reports/weekly/YYYY-MM-DD.json`, using the report date in Pacific time. This generated directory is ignored by Git because the reports contain private analytics, query, and landing-page data.

To verify the computation without credentials or network requests:

```sh
npm run report:weekly -- --dry-run
# Equivalent:
node scripts/weekly-report.mjs --dry-run
```

Dry-run numbers are built-in synthetic fixtures, not hoahwa.com results. The output labels them accordingly and writes to `reports/weekly/dry-run/YYYY-MM-DD.json` so it cannot overwrite a live report.

The two inclusive periods cover the last seven completed calendar dates in `America/Los_Angeles` and the preceding seven dates. Search Console interprets dates in Pacific time; GA4 interprets the same date strings in the property's reporting timezone, so these sources may have different day boundaries. Search Console requests `dataState: all` to include recent data, which may still be incomplete. Recent GA4 data can also change as processing finishes. Re-run later for updated numbers.

Totals are queried separately from the top 20 pages/queries and landing pages. Top lists are ranked separately for each period; an item absent from a top list has an unknown value, not necessarily zero. GA4 `totalUsers` is distinct within each result group, so channel users must not be added to infer property-wide users.

Week-over-week growth is `(current − previous) / previous × 100`. The +60% growth target applies to GSC clicks and GA4 sessions and means a current value of `previous × 1.6`. Progress toward the growth target is `WoW growth / 60 × 100`; negative progress indicates a decline. A zero baseline with positive current activity has no finite percentage change or meaningful percentage progress. CTR and average position are descriptive metrics rather than growth-target metrics; lower average position is better.

If required configuration is absent or invalid, the command exits with status **2** and identifies the setup step to complete. Authentication failures point back to the key setup; API access failures point to API enablement or property permissions. Check those steps without sharing the key or tokens. Dry-run verifies computation and output; a successful live run additionally verifies Google access and API responses.
