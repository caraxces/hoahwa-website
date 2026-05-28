#!/usr/bin/env node
/**
 * Deploy static export via Hostinger API (same flow as MCP hosting_deployStaticWebsite).
 *
 *   export HOSTINGER_API_TOKEN='...'   # hPanel → Account → API
 *   node scripts/deploy-hostinger-api.mjs
 *
 * Requires: pnpm build + out/ (or set SKIP_BUILD=1 and existing zip)
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOMAIN = process.env.HOSTINGER_DOMAIN || "hoahwa.com";
const USERNAME = process.env.HOSTINGER_USERNAME || "u525593444";
const API_BASE = "https://developers.hostinger.com";
const TOKEN =
  process.env.HOSTINGER_API_TOKEN || process.env.API_TOKEN || "";

if (!TOKEN) {
  console.error("Set HOSTINGER_API_TOKEN (hPanel → API).");
  process.exit(1);
}

const require = createRequire(import.meta.url);
let tus;
try {
  tus = require("tus-js-client");
} catch {
  console.error("Install tus-js-client: npm install -D tus-js-client");
  process.exit(1);
}

async function api(method, apiPath, body) {
  const res = await fetch(`${API_BASE}${apiPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`${method} ${apiPath} → ${res.status}: ${text}`);
  }
  return data;
}

function uploadTus(filePath, relativePath, uploadUrl, authToken, authRestToken) {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    const clean = uploadUrl.replace(/\/$/, "");
    const target = `${clean}/${relativePath}?override=true`;
    const headers = {
      "X-Auth": authToken,
      "X-Auth-Rest": authRestToken,
      "upload-length": String(stats.size),
      "upload-offset": "0",
    };

    fetch(target, { method: "POST", headers })
      .then((r) => {
        if (r.status !== 201) {
          throw new Error(`TUS init ${r.status}: ${r.statusText}`);
        }
        const stream = fs.createReadStream(filePath);
        const upload = new tus.Upload(stream, {
          uploadUrl: target,
          retryDelays: [1000, 2000, 4000, 8000],
          chunkSize: 5 * 1024 * 1024,
          headers,
          uploadSize: stats.size,
          metadata: { filename: path.basename(relativePath) },
          onError: reject,
          onSuccess: () => resolve({ filename: relativePath }),
        });
        upload.start();
      })
      .catch(reject);
  });
}

async function main() {
  if (process.env.SKIP_BUILD !== "1") {
    console.log("→ Building…");
    execSync("pnpm build", { cwd: ROOT, stdio: "inherit" });
  }

  const zipName = "hoahwa-public_html.zip";
  const zipPath = path.join(ROOT, zipName);
  if (!fs.existsSync(path.join(ROOT, "out"))) {
    console.error("Missing out/ — run pnpm build");
    process.exit(1);
  }
  console.log("→ Creating zip…");
  execSync(`cd out && zip -r -q "${zipPath}" .`, { cwd: ROOT, shell: true });

  console.log("→ Fetching upload URL…");
  const creds = await api("POST", "/api/hosting/v1/files/upload-urls", {
    username: USERNAME,
    domain: DOMAIN,
  });

  const { url: uploadUrl, auth_key: authKey, rest_auth_key: restKey } = creds;
  if (!uploadUrl || !authKey || !restKey) {
    throw new Error(`Invalid upload credentials: ${JSON.stringify(creds)}`);
  }

  console.log(`→ Uploading ${zipName} (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(1)} MB)…`);
  await uploadTus(zipPath, zipName, uploadUrl, authKey, restKey);

  console.log("→ Triggering deploy…");
  const deploy = await api(
    "POST",
    `/api/hosting/v1/accounts/${USERNAME}/websites/${DOMAIN}/deploy`,
    { archive_path: zipName }
  );

  console.log("→ Deploy response:", JSON.stringify(deploy, null, 2));
  console.log(`\nDone. Open https://${DOMAIN}/ (may take 1–2 min to extract).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
