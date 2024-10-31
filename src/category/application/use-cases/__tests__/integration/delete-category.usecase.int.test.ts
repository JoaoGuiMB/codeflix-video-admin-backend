import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import { CategoryDrizzleRepository } from "../../../../infra/db/drizzle/category-drizzle.repository";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Category } from "../../../../domain/category.entity";
import { db } from "../../../../../shared/infra/db/drizzle/connection";
import { sql } from "drizzle-orm";
describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryDrizzleRepository;

  beforeEach(() => {
    repository = new CategoryDrizzleRepository();
    useCase = new DeleteCategoryUseCase(repository);
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

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await useCase.execute({
      id: category.category_id.id,
    });
    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });
});
