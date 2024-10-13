import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category Unit Tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  it("should create a new category through the factory", () => {
    const category = Category.create({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Category 1");
    expect(category.description).toBe("Category 1 description");
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
    expect(validateSpy).toHaveBeenCalled();
  });

  it("should create a new category with constructor", () => {
    const category = new Category({
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
      created_at: new Date(),
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
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
    expect(validateSpy).toHaveBeenCalledTimes(2);
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

  it("should create category with id", () => {
    const id = new Uuid();
    const category = new Category({
      category_id: id,
      name: "Category 1",
      description: "Category 1 description",
      is_active: true,
      created_at: new Date(),
    });

    expect(category.category_id).toBe(id);
  });
});
