import { Category } from "../category/domain/category.entity";

describe("Category Unit Tests", () => {
  it("should create a new category through the factory", () => {
    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });

    expect(category.name).toBe("Category 1");
    expect(category.description).toBe("Category 1 description");
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should create a new category with constructor", () => {
    const category = new Category({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
      created_at: new Date(),
    });

    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe("Category 1");
    expect(category.description).toBe("Category 1 description");
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should change the name of the category", () => {
    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });

    category.changeName("Category 2");

    expect(category.name).toBe("Category 2");
  });

  it("should change the description of the category", () => {
    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });

    category.changeDescription("Category 2 description");

    expect(category.description).toBe("Category 2 description");
  });

  it("should activate the category", () => {
    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
      is_active: false,
    });

    category.activate();

    expect(category.is_active).toBe(true);
  });

  it("should deactivate the category", () => {
    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });

    category.deactivate();

    expect(category.is_active).toBe(false);
  });
});
