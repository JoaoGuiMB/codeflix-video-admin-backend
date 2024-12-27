import { SortDirection } from '@core/shared/domain/repository/search-params';
export interface ListVideosDTO {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  categories_id?: string[];
  genres_id?: string[];
  cast_members_id?: string[];
  title?: string;
}
