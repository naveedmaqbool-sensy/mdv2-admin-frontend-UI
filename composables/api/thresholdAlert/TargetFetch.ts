import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type AdminAlertTarget from '~/types/interfaces/database/AdminAlertTarget'

interface ThresholdAlertTargetFetchRequest extends PaginationRequest {
  adminAlertId: number
  isStore: boolean
}
interface ThresholdAlertTargetFetchResponse
  extends PaginationResponse<AdminAlertTarget> {}

export class ThresholdAlertTargetFetchRequestFactory
  implements ThresholdAlertTargetFetchRequest
{
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public adminAlertId: number = 0,
    public isStore: boolean = false,
    public page: number = 1,
    public perPage: number = 20
  ) {}
}

export function apiThresholdAlertTargetFetch(
  request: ThresholdAlertTargetFetchRequest
): Promise<ThresholdAlertTargetFetchResponse | null> {
  return apiGet('/threshold-alert/targets', request)
}
