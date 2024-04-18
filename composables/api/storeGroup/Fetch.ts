import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type StoreGroup from '~/types/interfaces/database/SensyCloud/StoreGroup'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<StoreGroup> {}

export function apiStoreGroupFetch(
  _request: Request
): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      storeGroupName: '店舗グループＡ',
    },
    {
      storeGroupName: '店舗グループＢ',
    },
    {
      storeGroupName: '店舗グループＣ',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
