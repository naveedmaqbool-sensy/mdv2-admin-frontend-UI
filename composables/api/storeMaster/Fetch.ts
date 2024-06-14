import type {
  PaginationRequest,
  PaginationResponse,
} from '~/types/interfaces/common/Pagination'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

interface Request extends PaginationRequest {}
interface Response extends PaginationResponse<StoreMaster> {}

export function apiStoreMasterFetch(
  request: Request
): Promise<Response | null> {
  return apiGet('/stores', request)
}
