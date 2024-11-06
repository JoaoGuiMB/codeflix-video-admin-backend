import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { ListCategoriesOutput } from '@core/category/application/use-cases/list-categories/list-categories.use-case';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;
  is_active: boolean;

  constructor(category: CategoryOutput) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.created_at = category.created_at;
    this.is_active = category.is_active;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListCategoriesOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((i) => new CategoryPresenter(i));
  }
}
