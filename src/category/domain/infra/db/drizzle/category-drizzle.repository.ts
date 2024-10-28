import { asc, desc, eq, ilike, like } from "drizzle-orm";
import { Entity } from "../../../../../shared/domain/entity";
import { SearchParams } from "../../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../../shared/domain/repository/search-result";
import { ValueObject } from "../../../../../shared/domain/value-object";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { db } from "../../../../../shared/infra/db/drizzle/connection";
import { categorySchema } from "../../../../../shared/infra/db/drizzle/schemas/category";
import { Category } from "../../../category.entity";
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../category.repository";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";

export class CategoryDrizzleRepository implements ICategoryRepository {
  sortableFields: string[] = ["name", "created_at"];

  async insert(entity: Category): Promise<void> {
    await db.insert(categorySchema).values({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await db.insert(categorySchema).values(
      entities.map((e) => {
        return {
          category_id: e.category_id.id,
          name: e.name,
          description: e.description,
          is_active: e.is_active,
          created_at: e.created_at,
        };
      })
    );
  }

  private async _get(id: string): Promise<Category | null> {
    const foundCategory = await db
      .select()
      .from(categorySchema)
      .where(eq(categorySchema.category_id, id));
    if (foundCategory.length === 0) {
      return null;
    }
    return new Category({
      ...foundCategory[0],
      category_id: new Uuid(foundCategory[0].category_id),
    });
  }

  async findById(entity_id: Uuid): Promise<Category | null> {
    return this._get(entity_id.id);
  }

  async findAll(): Promise<Category[]> {
    const entities = await db.select().from(categorySchema).all();
    return entities.map(
      (e) =>
        new Category({
          category_id: new Uuid(e.category_id),
          name: e.name,
          description: e.description,
          is_active: e.is_active,
          created_at: e.created_at,
        })
    );
  }

  async update(entity: Category): Promise<void> {
    const id = entity.category_id.id;
    const foundCategory = this._get(id);
    if (!foundCategory) {
      throw new NotFoundError(id, this.getEntity());
    }
    await db
      .update(categorySchema)
      .set({
        category_id: entity.category_id.id,
        created_at: entity.created_at,
        description: entity.description,
        is_active: entity.is_active,
        name: entity.name,
      })
      .where(eq(categorySchema.category_id, entity.category_id.id));
  }

  async delete(entity: Uuid): Promise<void> {
    const id = entity.id;
    const foundCategory = this._get(id);
    if (!foundCategory) {
      throw new NotFoundError(id, this.getEntity());
    }
    await db.delete(categorySchema).where(eq(categorySchema.category_id, id));
  }

  async search(props: CategorySearchParams): Promise<SearchResult<Category>> {
    const hasSort = props.sort && this.sortableFields.includes(props.sort);
    const sortOrder = hasSort && props.sort_dir === "asc" ? asc : desc;

    const offset = (props.page - 1) * props.per_page;
    const foundCategories = await db
      .select()
      .from(categorySchema)
      .where(
        props.filter
          ? like(categorySchema.name, `%${props.filter}%`)
          : undefined
      )
      .limit(props.per_page)
      .offset(offset)
      .orderBy(
        hasSort
          ? sortOrder(categorySchema[props.sort])
          : desc(categorySchema.created_at)
      );

    return new CategorySearchResult({
      items: foundCategories.map(
        (e) =>
          new Category({
            category_id: new Uuid(e.category_id),
            name: e.name,
            description: e.description,
            is_active: e.is_active,
            created_at: e.created_at,
          })
      ),
      total: foundCategories.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
