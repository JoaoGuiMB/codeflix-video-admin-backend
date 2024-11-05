import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { Transform } from 'class-transformer';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(category: CategoryOutput) {
    this.id = category.id;
    this.name = category.name;
    this.description = category.description;
    this.created_at = category.created_at;
  }
}
