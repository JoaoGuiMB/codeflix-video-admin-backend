import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, closeDb } from "./connection";

migrate(db, { migrationsFolder: "sqlite/migrations" });
closeDb();
