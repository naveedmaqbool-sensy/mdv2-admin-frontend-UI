import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<StoreMaster> {}

export function apiStoreMasterFetch(
  _request: Request
): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      storeId: '1',
      storeName: '店舗1',
      zipCode: '100-0001',
      openHour: '10:00',
      closeHour: '20:00',
    },
    {
      storeId: '2',
      storeName: '店舗2',
      zipCode: '100-0001',
      openHour: '10:00',
      closeHour: '20:00',
    },
    {
      storeId: '3',
      storeName: '店舗3',
      zipCode: '100-0002',
      openHour: '8:00',
      closeHour: '18:00',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
