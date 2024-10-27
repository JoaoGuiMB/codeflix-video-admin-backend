import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./sqlite/migrations",
  schema: "./src/shared/infra/db/drizzle/schemas",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

// TODO: https://orm.drizzle.team/docs/drizzle-kit-generate you may need this in the future for tests
