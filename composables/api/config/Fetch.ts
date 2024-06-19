import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type Sortable from '~/types/interfaces/common/Sortable'
import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'

interface ConfigFetchRequest extends PaginationRequest, Sortable {}
interface ConfigFetchResponse extends PaginationResponse<AdminAlertThreshold> {}

export class ConfigFetchRequestFactory implements ConfigFetchRequest {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public page: number = 1,
    public perPage: number = 10,
    public sortBy: string[] = [],
    public isDescending: boolean = true
  ) {}
}

export function apiConfigFetch(
  request: ConfigFetchRequest
): Promise<ConfigFetchResponse | null> {
  return apiGet('/admin-alert-thresholds', request)
}
