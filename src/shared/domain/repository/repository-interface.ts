import { Entity } from "../entity";
import { ValueObject } from "../value-object";
import { SearchParams } from "./search-params";
import { SearchResult } from "./search-result";

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity: EntityId): Promise<void>;

  findById(entity_id: ValueObject): Promise<E | null>;
  findAll(): Promise<E[]>;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  SearchInput = SearchParams,
  SeachtOutput = SearchResult
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SeachtOutput>;
}
