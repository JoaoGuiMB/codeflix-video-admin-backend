import { sql } from "drizzle-orm";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { db } from "../../../../shared/infra/db/drizzle/connection";
import { CategoryDrizzleRepository } from "../../../infra/db/drizzle/category-drizzle.repository";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryDrizzleRepository;

  beforeEach(() => {
    repository = new CategoryDrizzleRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  afterEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should create a category", async () => {
    let output = await useCase.execute({ name: "test" });
    let entity = await repository.findById(new Uuid(output.id));
    expect(output.id).toEqual(entity.category_id.id);
    expect(output.name).toEqual("test");
    expect(output.description).toEqual(null);
    expect(output.is_active).toEqual(true);
    expect(new Date(output.created_at)).toBeInstanceOf(Date);

    output = await useCase.execute({
      name: "test",
      description: "some description",
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output.id).toEqual(entity.category_id.id);
    expect(output.name).toEqual("test");
    expect(output.description).toEqual("some description");
    expect(output.is_active).toEqual(true);
    expect(new Date(output.created_at)).toBeInstanceOf(Date);

    output = await useCase.execute({
      name: "test",
      description: "some description",
      is_active: true,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output.id).toEqual(entity.category_id.id);
    expect(output.name).toEqual("test");
    expect(output.description).toEqual("some description");
    expect(output.is_active).toEqual(true);
    expect(new Date(output.created_at)).toBeInstanceOf(Date);

    output = await useCase.execute({
      name: "test",
      description: "some description",
      is_active: false,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output.id).toEqual(entity.category_id.id);
    expect(output.name).toEqual("test");
    expect(output.description).toEqual("some description");
    expect(output.is_active).toEqual(false);
    expect(new Date(output.created_at)).toBeInstanceOf(Date);
  });
});
