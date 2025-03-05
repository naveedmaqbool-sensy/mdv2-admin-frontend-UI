import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type Sortable from '~/types/interfaces/common/Sortable'
import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'

interface OrderConditionsFetchRequest extends PaginationRequest, Sortable {
  storeIds: string[]
  skuIds: string[]
  groupIds: string[]
  departmentIds: string[]
  lineIds: string[]
  classIds: string[]
  from: Date | string | null
  to: Date | string | null
}
interface OrderConditionsFetchResponse
  extends PaginationResponse<OrderConditionsMaster> {}

export class OrderConditionsFetchRequestFactory
  implements OrderConditionsFetchRequest
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public page: number = 1,
    public perPage: number = 20,
    public sortBy: string[] = [],
    public isDescending: boolean = true,
    public storeIds: string[] = [],
    public skuIds: string[] = [],
    public groupIds: string[] = [],
    public departmentIds: string[] = [],
    public lineIds: string[] = [],
    public classIds: string[] = [],
    public from: Date | string | null = null,
    public to: Date | string | null = null
  ) {}
}

export function apiOrderConditionsFetch(
  request: OrderConditionsFetchRequest
): Promise<OrderConditionsFetchResponse | null> {
  return apiPost('/order-conditions/fetch', request)
}
