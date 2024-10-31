import { ListCategoriesUseCase } from "../../list-categories.use-case";
import { CategoryDrizzleRepository } from "../../../../infra/db/drizzle/category-drizzle.repository";
import { Category } from "../../../../domain/category.entity";

import { CategoryOutputMapper } from "../../common/category-output";
import { sql } from "drizzle-orm";
import { db } from "../../../../../shared/infra/db/drizzle/connection";

describe("ListCategoriesUseCase Integration Tests", () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategoryDrizzleRepository;

  beforeEach(() => {
    repository = new CategoryDrizzleRepository();
    useCase = new ListCategoriesUseCase(repository);
  });

  afterEach(() => {
    const queries = ["DELETE FROM categories"];

    queries.forEach((q) => db.run(sql.raw(q)));
  });

  it("should return output sorted by created_at when input param is empty", async () => {
    const categories = Category.fake()
      .theCategories(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(categories);
    const output = await useCase.execute({});

    expect(output.last_page).toEqual(1);
    expect(output.current_page).toEqual(1);
    expect(output.per_page).toEqual(15);
    expect(output.total).toEqual(2);
    expect(output.items.length).toEqual(2);
    expect(output.items[0].name).toEqual(categories[0].name);
    expect(output.items[1].name).toEqual(categories[1].name);
  });

  it("should returns output using pagination, sort and filter", async () => {
    const categories = [
      new Category({ name: "a" }),
      new Category({
        name: "AAA",
      }),
      new Category({
        name: "AaA",
      }),
      new Category({
        name: "b",
      }),
      new Category({
        name: "c",
      }),
    ];
    await repository.bulkInsert(categories);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output.last_page).toEqual(1);
    expect(output.current_page).toEqual(1);
    expect(output.per_page).toEqual(2);
    expect(output.total).toEqual(2);
    expect(output.items.length).toEqual(2);
    expect(output.items[0].name).toEqual(categories[1].name);
    expect(output.items[1].name).toEqual(categories[2].name);

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output.last_page).toEqual(1);
    expect(output.current_page).toEqual(2);
    expect(output.per_page).toEqual(2);
    expect(output.total).toEqual(1);
    expect(output.items.length).toEqual(1);
    expect(output.items[0].name).toEqual(categories[0].name);

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });

    expect(output.last_page).toEqual(1);
    expect(output.current_page).toEqual(1);
    expect(output.per_page).toEqual(2);
    expect(output.total).toEqual(2);
    expect(output.items.length).toEqual(2);
    expect(output.items[0].name).toEqual(categories[0].name);
    expect(output.items[1].name).toEqual(categories[2].name);
  });
});
