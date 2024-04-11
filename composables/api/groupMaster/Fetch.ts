import type GroupMaster from '~/types/interfaces/SensyCloud/GroupMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<GroupMaster> {}

export function apiGroupMasterFetch(
  _request: Request
): Promise<Response | null> {
  // FIXME: rfukuma モック
  const mockData = [
    {
      groupId: '1',
      groupName: '部門1',
    },
    {
      groupId: '2',
      groupName: '部門2',
    },
    {
      groupId: '3',
      groupName: '部門3',
    },
  ]
  return Promise.resolve({
    data: mockData,
    total: mockData.length,
  })
}
