import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<GroupMaster> {}

export function apiGroupMasterFetch(
  request: Request
): Promise<Response | null> {
  return apiGet('/groups', request)
}
