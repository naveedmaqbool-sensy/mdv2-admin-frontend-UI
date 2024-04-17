import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
// FIXME: rfukuma 型定義作ったら入れる
interface Response
  extends PaginationResponse<{ skuId: string; skuName: string }> {}

export function apiSkuMasterFetch(_request: Request): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      skuId: '1',
      skuName: 'ジンジャーエール（コカ・コーラ）',
    },
    {
      skuId: '2',
      skuName: 'ジンジャーエール（ウィルキンソン）',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
