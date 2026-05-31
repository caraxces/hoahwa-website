/**
 * Seed demo portfolio builder account on Hostinger MySQL via PHP API.
 *
 * Usage:
 *   npm run portfolio:seed
 *
 * Requires portfolio-seed.php deployed, or run against production URL.
 */

const SEED_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_SEED_API_URL ??
  "https://hoahwa.com/api/portfolio-seed.php";

async function main() {
  const res = await fetch(SEED_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "seed_demo" }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.ok) {
    console.error("Seed failed:", data.error ?? res.statusText);
    process.exit(1);
  }

  console.log(data.message);
  console.log("Demo login:");
  console.log(`  Username: ${data.credentials.username}`);
  console.log(`  Password: ${data.credentials.password}`);
  console.log(`  Builder:  https://hoahwa.com${data.login_url}`);
}

main();
