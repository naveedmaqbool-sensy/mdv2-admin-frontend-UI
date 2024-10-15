import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type User from '~/types/interfaces/database/User'
import type UserFormData from '~/types/interfaces/page/user/FormData'

interface UserFetchRequest extends UserFormData, PaginationRequest {}
interface UserFetchResponse extends PaginationResponse<User> {}

export class UserFetchRequestFactory implements UserFetchRequest {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public text: string | null = null,
    public page: number = 1,
    public perPage: number = 20
  ) {}
}

export function apiUserFetch(
  request: UserFetchRequest
): Promise<UserFetchResponse | null> {
  return apiGet('/users', request)
}
