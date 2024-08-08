import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type SkuAlert from '~/types/interfaces/database/SkuAlert'
import type AlertFormData from '~/types/interfaces/page/alert/FormData'

interface StockAlertFetchRequest extends PaginationRequest, AlertFormData {}
interface StockAlertFetchResponse extends PaginationResponse<SkuAlert> {}

export class StockAlertFetchRequestFactory implements StockAlertFetchRequest {
  public from!: Date
  public to!: Date
  constructor(
    public page: number = 1,
    public perPage: number = 10,
    from: Date | null = null,
    to: Date | null = null
  ) {
    this.from = from ?? new Date()
    this.to = to ?? new Date()
  }
}

export function apiStockAlertFetch(
  request: StockAlertFetchRequest
): Promise<StockAlertFetchResponse | null> {
  return apiGet('/stock-alerts', request)
}
