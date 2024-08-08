import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<LineMaster> {}

export function apiLineMasterFetch(request: Request): Promise<Response | null> {
  return apiGet('/lines', request)
}
