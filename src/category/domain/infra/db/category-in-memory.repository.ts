import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { InMemoryRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../category.entity";
import { ICategoryRepository } from "../../category.repository";

export class CategoryInMemoryRepository extends InMemoryRepository<
  Category,
  Uuid
> {
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
