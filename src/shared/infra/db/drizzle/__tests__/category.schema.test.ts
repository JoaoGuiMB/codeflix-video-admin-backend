import { db } from "../connection";
import { categorySchema } from "../schemas/category";
import { sql } from "drizzle-orm";

describe("CategorySchema", () => {
  beforeEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should create a category", async () => {
    await db.insert(categorySchema).values({
      name: "test",
      description: "test",
      is_active: true,
      created_at: new Date(),
    });

    const category = await db.select().from(categorySchema).all();
    expect(category).toHaveLength(1);
  });
});
