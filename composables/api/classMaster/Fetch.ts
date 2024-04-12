import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<ClassMaster> {}

export function apiClassMasterFetch(
  _request: Request
): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      classId: '1',
      className: '種別1',
      departmentId: '1',
      groupId: '1',
      lineId: '1',
    },
    {
      classId: '2',
      className: '種別2',
      departmentId: '2',
      groupId: '2',
      lineId: '2',
    },
    {
      classId: '3',
      className: '種別3',
      departmentId: '3',
      groupId: '3',
      lineId: '3',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
