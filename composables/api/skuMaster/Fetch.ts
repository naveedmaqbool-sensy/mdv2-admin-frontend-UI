import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
// FIXME: rfukuma 型定義作ったら入れる
interface Response
  extends PaginationResponse<{ skuId: string; skuName: string }> {}

export function apiSkuMasterFetch(request: Request): Promise<Response | null> {
  return apiGet('/skus', request)
}
