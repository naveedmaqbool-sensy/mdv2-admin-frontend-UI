import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type MonitoingFormData from '~/types/interfaces/page/monitoring/FormData'

export interface ApiMonitoringDetailRequest
  extends MonitoingFormData,
    PaginationRequest {
  targetId: string
  searchText: string
}
interface ApiMonitoringDetailResponse
  extends PaginationResponse<// 発注修正明細
  {
    date: string
    storeId: string
    storeName: string
    departmentName: string
    skuId: string
    skuName: string
    recommendedOrderQty: number // 発注推奨数
    actualOrderQty: number // 実発注数
    differenceOrderQty: number // 差異発注数
  }> {}

export function apiMonitoringDetail(
  request: ApiMonitoringDetailRequest
): Promise<ApiMonitoringDetailResponse | null> {
  return apiPost('/monitoring/detail', request)
}
