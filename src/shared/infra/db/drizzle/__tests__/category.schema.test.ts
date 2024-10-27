import { Category } from "../../../../../category/domain/category.entity";
import { db } from "../connection";
import { categorySchema } from "../schemas/category";
import { sql } from "drizzle-orm";

describe("CategorySchema", () => {
  afterEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should create a category", async () => {
    const fakeCategory = Category.fake().aCategory().build();
    await db.insert(categorySchema).values({
      category_id: fakeCategory.category_id.id,
      name: fakeCategory.name,
      description: fakeCategory.description,
      is_active: fakeCategory.is_active,
      created_at: fakeCategory.created_at,
    });

    const category = await db.select().from(categorySchema).all();
    expect(category).toHaveLength(1);
    expect(category[0].category_id).toEqual(fakeCategory.category_id.id);
  });
});
