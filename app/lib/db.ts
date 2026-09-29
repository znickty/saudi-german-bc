import mysql, {ResultSetHeader} from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (!global.__mysqlPool) {
    global.__mysqlPool = mysql.createPool({
      host: process.env.MYSQLHOST,
      port: Number(process.env.MYSQLPORT),
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
      timezone: "Z",
    });
  }
  return global.__mysqlPool;
}

// SELECT — returns rows array
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

// SELECT — returns one row or null
export async function queryOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

// INSERT / UPDATE / DELETE — returns ResultSetHeader
export async function execute(
  sql: string,
  params: any[] = []
): Promise<ResultSetHeader> {
  const pool = getPool();
  const [result] = await pool.execute(sql, params);
  return result as ResultSetHeader;
}