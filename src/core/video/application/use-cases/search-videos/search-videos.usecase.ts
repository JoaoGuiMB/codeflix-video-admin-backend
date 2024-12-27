import { ICategoryRepository } from '@core/category/domain/category.repository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  IVideoRepository,
  VideoSearchParams,
  VideoSearchResult,
  VideoFilter,
} from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video-output';
import { IGenreRepository } from '@core/genre/domain/genre.repository';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';

export class ListVideosUseCase
  implements IUseCase<ListVideosInput, ListVideosOutput>
{
  constructor(
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,
    private genreRepo: IGenreRepository,
    private castMemberRepo: ICastMemberRepository,
  ) {}

  async execute(input: ListVideosInput): Promise<ListVideosOutput> {
    const params = VideoSearchParams.create(input);
    const searchResult = await this.videoRepo.search(params);

    return await this.toOutput(searchResult);
  }

  private async toOutput(
    searchResult: VideoSearchResult,
  ): Promise<ListVideosOutput> {
    const { items: _items } = searchResult;

    const items: VideoOutput[] = [];
    for (const i of _items) {
      const genres = await this.genreRepo.findByIds(
        Array.from(i.genres_id.values()),
      );

      const categories = await this.categoryRepo.findByIds(
        Array.from(i.categories_id.values()).concat(
          genres.flatMap((g) => Array.from(g.categories_id.values())),
        ),
      );

      const cast_members = await this.castMemberRepo.findByIds(
        Array.from(i.cast_members_id.values()),
      );

      const video = VideoOutputMapper.toOutput({
        video: i,
        genres,
        allCategoriesOfVideoAndGenre: categories,
        cast_members,
      });

      items.push(video);
    }

    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListVideosInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: VideoFilter;
};

export type ListVideosOutput = PaginationOutput<VideoOutput>;
