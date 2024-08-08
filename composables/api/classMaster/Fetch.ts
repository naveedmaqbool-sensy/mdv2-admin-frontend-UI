import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<ClassMaster> {}

export function apiClassMasterFetch(
  request: Request
): Promise<Response | null> {
  return apiGet('/classes', request)
}
