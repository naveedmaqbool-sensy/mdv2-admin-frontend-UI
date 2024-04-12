import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<DepartmentMaster> {}

export function apiDepartmentMasterFetch(
  _request: Request
): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      departmentId: '1',
      departmentName: '中分類1',
      groupId: '1',
    },
    {
      departmentId: '2',
      departmentName: '中分類2',
      groupId: '2',
    },
    {
      departmentId: '3',
      departmentName: '中分類3',
      groupId: '3',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
