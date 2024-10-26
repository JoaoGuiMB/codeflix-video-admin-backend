import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database(process.env.DATABASE_URL);

export const db = drizzle({ client: sqlite });

export const closeDb = () => {
  sqlite.close();
};
