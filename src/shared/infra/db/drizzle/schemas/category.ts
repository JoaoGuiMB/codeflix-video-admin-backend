import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

export const categorySchema = table("categories", {
  category_id: t.text().primaryKey().notNull(),
  name: t.text({ length: 256 }).notNull(),
  description: t.text({ length: 256 }),
  is_active: t.integer({ mode: "boolean" }).notNull(),
  created_at: t.integer({ mode: "timestamp" }).notNull(),
});
