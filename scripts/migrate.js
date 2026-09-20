const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "sgbc_user",
    password: process.env.DB_PASSWORD || "sgbc_pass",
    database: process.env.DB_NAME || "sgbc",
    multipleStatements: true,
  });

  await conn.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const dir = path.join(__dirname, "..", "db", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  const [rows] = await conn.query("SELECT name FROM _migrations");
  const applied = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (applied.has(file)) { console.log(`↷ skip ${file}`); continue; }
    console.log(`▶ applying ${file}`);
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    await conn.query(sql);
    await conn.query("INSERT INTO _migrations (name) VALUES (?)", [file]);
  }

  await conn.end();
  console.log("✔ migrations complete");
}

main().catch((e) => { console.error(e); process.exit(1); });