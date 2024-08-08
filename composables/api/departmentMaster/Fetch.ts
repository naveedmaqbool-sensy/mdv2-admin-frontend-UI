import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<DepartmentMaster> {}

export function apiDepartmentMasterFetch(
  request: Request
): Promise<Response | null> {
  return apiGet('/departments', request)
}
