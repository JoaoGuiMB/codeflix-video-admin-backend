import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMember, CastMemberId } from './cast-member.aggregate';

export type CastMemberFilter = string;

export class CategorySearchParams extends SearchParams<CastMemberFilter> {}

export class CategorySearchResult extends SearchResult<CastMember> {}

export type ICastMemberRepository = ISearchableRepository<
  CastMember,
  CastMemberId,
  CastMemberFilter,
  CategorySearchParams,
  CategorySearchResult
>;
