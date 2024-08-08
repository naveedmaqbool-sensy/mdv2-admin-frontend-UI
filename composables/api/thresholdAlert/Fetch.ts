import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type AdminAlert from '~/types/interfaces/database/AdminAlert'
import type AlertFormData from '~/types/interfaces/page/alert/FormData'

interface ThresholdAlertFetchRequest extends PaginationRequest, AlertFormData {}
interface ThresholdAlertFetchResponse extends PaginationResponse<AdminAlert> {}

export class ThresholdAlertFetchRequestFactory
  implements ThresholdAlertFetchRequest
{
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

export function apiThresholdAlertFetch(
  request: ThresholdAlertFetchRequest
): Promise<ThresholdAlertFetchResponse | null> {
  return apiGet('/threshold-alerts', request)
}
