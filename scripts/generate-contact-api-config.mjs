#!/usr/bin/env node
/**
 * Writes public/api/config.php from environment variables (never commit config.php).
 *
 *   export HOSTINGER_DB_PASS='…'
 *   node scripts/generate-contact-api-config.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/api/config.php");

const dbHost = process.env.HOSTINGER_DB_HOST || "localhost";
const dbName = process.env.HOSTINGER_DB_NAME || "u525593444_hoahwa";
const dbUser = process.env.HOSTINGER_DB_USER || "u525593444_hoa";
const dbPass = process.env.HOSTINGER_DB_PASS || process.env.HOSTINGER_DB_PASSWORD || "";

if (!dbPass) {
  console.error("Set HOSTINGER_DB_PASS before generating config.php");
  process.exit(1);
}

const origins = (process.env.CONTACT_ALLOWED_ORIGINS ||
  "https://hoahwa.com,https://www.hoahwa.com,http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const php = `<?php
// Auto-generated — do not commit. Regenerate via scripts/generate-contact-api-config.mjs
return [
    'db_host' => ${phpString(dbHost)},
    'db_name' => ${phpString(dbName)},
    'db_user' => ${phpString(dbUser)},
    'db_pass' => ${phpString(dbPass)},
    'allowed_origins' => [
${origins.map((o) => `        ${phpString(o)},`).join("\n")}
    ],
];
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, php, "utf8");
console.log(`→ Wrote ${OUT}`);

function phpString(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}
