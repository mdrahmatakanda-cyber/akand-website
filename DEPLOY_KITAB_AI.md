# কিতাব AI — Cloudflare deployment

এই project এখন Cloudflare Workers Static Assets + Worker API architecture-এর জন্য প্রস্তুত। বর্তমান Akand website `site/`-এর মধ্যেই থাকে; Kitab AI `/kitab-ai/`-এ।

## 1. Cloudflare D1
Cloudflare Dashboard → Workers & Pages → D1 SQL Database → Create database.
Database name: `akand-kitab-ai`

তারপর `schema.sql`-এর SQL একবার execute করুন। Database ID কপি করুন।

## 2. Wrangler config
`wrangler.jsonc`-এ:
`REPLACE_WITH_YOUR_D1_DATABASE_ID` → আপনার D1 Database ID.

Workers AI binding-ও এই config-এ আছে (`AI`). Cloudflare dashboard-এ Worker-এর AI binding enable করতে হবে যদি Git deployment config তা নিজে না নেয়।

## 3. GitHub
পুরো project root repository-তে push করুন। Cloudflare Workers Builds-এর deploy command যদি শুধু static upload করে থাকে, সেটি Wrangler deployment-এ পরিবর্তন করুন:
`npx wrangler deploy`

Build command প্রয়োজন নেই। Root directory repository root।

## 4. Result
`https://akand.mdrahmatakanda.workers.dev/kitab-ai/`

## Supported uploads
TXT, MD, PDF. PDF uses Workers AI Markdown Conversion. EPUB is intentionally not enabled in this deployment package because Cloudflare's current native Markdown Conversion supported-format list does not include EPUB; EPUB support should be added with a dedicated parser before enabling it.
