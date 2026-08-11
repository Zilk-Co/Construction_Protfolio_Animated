import pg from "pg";
const p = new pg.Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
const tables = await p.query("select tablename from pg_tables where schemaname='public' order by tablename");
console.log("tables:", tables.rows.map((x) => x.tablename).join(", ") || "(no tables)");
for (const t of ["projects", "machinery", "settings", "page_content", "services", "documents", "categories"]) {
  try {
    const r = await p.query(`select count(*)::int as n from ${t}`);
    console.log(`${t}: ${r.rows[0].n} row(s)`);
  } catch {
    console.log(`${t}: (missing)`);
  }
}
const st = await p.query("select key, value from settings order by key");
console.log("settings:", JSON.stringify(st.rows));
const pr = await p.query("select count(*)::int as n from projects");
await p.end();
