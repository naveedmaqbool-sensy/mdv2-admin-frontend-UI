import type LineMaster from '~/types/interfaces/SensyCloud/LineMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<LineMaster> {}

export function apiLineMasterFetch(
  _request: Request
): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      lineId: '1',
      lineName: '小分類1',
      departmentId: '1',
      groupId: '1',
    },
    {
      lineId: '2',
      lineName: '小分類2',
      departmentId: '2',
      groupId: '2',
    },
    {
      lineId: '3',
      lineName: '小分類3',
      departmentId: '3',
      groupId: '3',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
