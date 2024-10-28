import { sql } from "drizzle-orm";
import { db } from "../../../../../shared/infra/db/drizzle/connection";
import { Category } from "../../../category.entity";
import { CategoryDrizzleRepository } from "./category-drizzle.repository";
import {
  CategorySearchParams,
  CategorySearchResult,
} from "../../../category.repository";

describe("CategoryDrizzleRepository Integration Tests", () => {
  let repository: CategoryDrizzleRepository;

  beforeEach(() => {
    repository = new CategoryDrizzleRepository();
  });

  afterEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should insert a new category", async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const foundCategory = await repository.findById(category.category_id);

    expect(foundCategory).toBeDefined();
    expect(foundCategory?.category_id.id).toBe(category.category_id.id);
    expect(foundCategory?.name).toBe(category.name);
    expect(foundCategory?.description).toBe(category.description);
    expect(foundCategory?.is_active).toBe(category.is_active);
  });

  it("should bulk insert categories", async () => {
    const categoryA = Category.fake().aCategory().build();
    const categoryB = Category.fake().aCategory().build();

    const categories = [categoryA, categoryB];
    await repository.bulkInsert(categories);

    const foundCategories = await repository.findAll();

    expect(foundCategories).toHaveLength(2);
    expect(foundCategories[0].category_id.id).toBe(
      categories[0].category_id.id
    );
    expect(foundCategories[0].name).toBe(categories[0].name);
    expect(foundCategories[0].description).toBe(categories[0].description);
    expect(foundCategories[0].is_active).toBe(categories[0].is_active);

    expect(foundCategories[1].category_id.id).toBe(
      categories[1].category_id.id
    );
  });

  it("should update a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const categoryUpdated = Category.fake().aCategory().build();
    categoryUpdated.category_id = category.category_id;
    await repository.update(categoryUpdated);

    const foundCategory = await repository.findById(category.category_id);

    expect(foundCategory).toBeDefined();
    expect(foundCategory?.category_id.id).toBe(category.category_id.id);
    expect(foundCategory?.name).toBe(categoryUpdated.name);
    expect(foundCategory?.description).toBe(categoryUpdated.description);
    expect(foundCategory?.is_active).toBe(categoryUpdated.is_active);
  });

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    await repository.delete(category.category_id);

    const foundCategory = await repository.findById(category.category_id);

    expect(foundCategory).toBeNull();
  });

  it("should search categories", async () => {
    const created_at = new Date();
    const categories = Category.fake()
      .theCategories(16)
      .withName("Movie")
      .withCreatedAt(created_at)
      .build();

    const searchOutput = await repository.search(new CategorySearchParams({}));
    searchOutput.items.forEach((item) => {
      expect(item).toBeInstanceOf(Category);
      expect(item.category_id).toBeDefined();
    });
  });

  it("should order by created_at DESC when search params are null", async () => {
    const created_at = new Date();
    const categories = Category.fake()
      .theCategories(16)
      .withName((index) => `Movie ${index}`)
      .withDescription(null)
      .withCreatedAt((index) => new Date(created_at.getTime() + index))
      .build();
    const searchOutput = await repository.search(new CategorySearchParams());
    const items = searchOutput.items;
    [...items].reverse().forEach((item, index) => {
      expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`);
    });
  });

  it("should apply paginate and filter", async () => {
    const categories = [
      Category.fake()
        .aCategory()
        .withName("test")
        .withCreatedAt(new Date(new Date().getTime() + 5000))
        .build(),
      Category.fake()
        .aCategory()
        .withName("a")
        .withCreatedAt(new Date(new Date().getTime() + 4000))
        .build(),
      Category.fake()
        .aCategory()
        .withName("TEST")
        .withCreatedAt(new Date(new Date().getTime() + 3000))
        .build(),
      Category.fake()
        .aCategory()
        .withName("TeSt")
        .withCreatedAt(new Date(new Date().getTime() + 1000))
        .build(),
    ];

    await repository.bulkInsert(categories);

    let searchOutput = await repository.search(
      new CategorySearchParams({
        page: 1,
        per_page: 2,
        filter: "TEST",
      })
    );

    expect(searchOutput.items[0].entity_id.id).toBe(
      categories[0].category_id.id
    );
    expect(searchOutput.items[1].entity_id.id).toBe(
      categories[2].category_id.id
    );
    expect(searchOutput.total).toBe(2);
    expect(searchOutput.current_page).toBe(1);
    expect(searchOutput.per_page).toBe(2);

    searchOutput = await repository.search(
      new CategorySearchParams({
        page: 2,
        per_page: 2,
        filter: "TEST",
      })
    );
    expect(searchOutput.items[0].entity_id.id).toBe(
      categories[3].category_id.id
    );
    expect(searchOutput.total).toBe(1);
    expect(searchOutput.current_page).toBe(2);
    expect(searchOutput.per_page).toBe(2);
  });
});
