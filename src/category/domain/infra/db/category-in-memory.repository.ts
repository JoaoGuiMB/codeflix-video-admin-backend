import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import {
  InMemoryRepository,
  InMemorySearchableRepository,
} from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../category.entity";
import { ICategoryRepository } from "../../category.repository";

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Uuid
> {
  sortableFields: string[] = ["name", "created_at"];
  protected async applyFilter(
    items: Category[],
    filter: string
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) =>
      i.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "name", "desc");
  }
}
