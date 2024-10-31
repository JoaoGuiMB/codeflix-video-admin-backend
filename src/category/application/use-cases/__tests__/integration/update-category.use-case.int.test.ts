import { sql } from "drizzle-orm";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { db } from "../../../../../shared/infra/db/drizzle/connection";
import { Category } from "../../../../domain/category.entity";
import { CategoryDrizzleRepository } from "../../../../infra/db/drizzle/category-drizzle.repository";
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe("UpdateCategoryUseCase Integration Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryDrizzleRepository;

  beforeEach(() => {
    repository = new CategoryDrizzleRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  afterEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should throws error when entity not found", async () => {
    const uuid = new Uuid();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: "fake" })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it("should update a category", async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: "test",
    });

    expect(output.id).toEqual(entity.category_id.id);
    expect(output.name).toEqual("test");
    expect(output.description).toEqual(entity.description);
    expect(output.is_active).toEqual(true);
    expect(new Date(output.created_at)).toBeInstanceOf(Date);

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          is_active: true,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: "test",
          description: null,
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: "test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...(i.input.name && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("is_active" in i.input && { is_active: i.input.is_active }),
      });
      const entityUpdated = await repository.findById(new Uuid(i.input.id));

      expect(output.id).toEqual(entity.category_id.id);
      expect(output.name).toEqual(i.expected.name);
      expect(output.description).toEqual(i.expected.description);
      expect(output.is_active).toEqual(i.expected.is_active);
      expect(new Date(output.created_at)).toBeInstanceOf(Date);

      expect(entityUpdated.entity_id.id).toEqual(entity.category_id.id);
      expect(entityUpdated.name).toEqual(i.expected.name);
      expect(entityUpdated.description).toEqual(i.expected.description);
      expect(entityUpdated.is_active).toEqual(i.expected.is_active);
      expect(new Date(entityUpdated.created_at)).toBeInstanceOf(Date);
    }
  });
});
