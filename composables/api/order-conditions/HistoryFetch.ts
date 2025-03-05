import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type Sortable from '~/types/interfaces/common/Sortable'
import type OrderConditionsMasterImport from '~/types/interfaces/database/OrderConditionsMasterImport'

interface OrderConditionsHistoryFetchRequest
  extends PaginationRequest,
    Sortable {
  uploadedDate: Date | string | null
  userNameText: string | null
  hasError: boolean
}
interface OrderConditionsHistoryFetchResponse
  extends PaginationResponse<OrderConditionsMasterImport> {}

export class OrderConditionsHistoryFetchRequestFactory
  implements OrderConditionsHistoryFetchRequest
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public page: number = 1,
    public perPage: number = 20,
    public sortBy: string[] = ['created_at'],
    public isDescending: boolean = true,
    public uploadedDate: Date | string | null = null,
    public userNameText: string | null = null,
    public hasError: boolean = true
  ) {}
}

export function apiOrderConditionsHistoryFetch(
  request: OrderConditionsHistoryFetchRequest
): Promise<OrderConditionsHistoryFetchResponse | null> {
  return apiPost('/order-conditions/history/fetch', request)
}
