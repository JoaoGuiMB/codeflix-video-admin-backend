import { sql } from "drizzle-orm";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { db } from "../../../../../shared/infra/db/drizzle/connection";

import { Category } from "../../../../domain/category.entity";
import { CategoryDrizzleRepository } from "../../../../infra/db/drizzle/category-drizzle.repository";

import { GetCategoryUseCase } from "../../get-category.use-case";

describe("GetCategoryUseCase Integration Tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryDrizzleRepository;

  beforeEach(() => {
    repository = new CategoryDrizzleRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  afterEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should throws error when entity not found", async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should returns a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.category_id.id });

    expect(output.id).toEqual(category.category_id.id);
    expect(output.name).toEqual(category.name);
    expect(output.description).toEqual(category.description);
    expect(output.is_active).toEqual(category.is_active);
    expect(new Date(output.created_at)).toBeInstanceOf(Date);
  });
});
