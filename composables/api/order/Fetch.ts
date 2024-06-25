import type { PaginationResponse } from '~/types/interfaces/common/Pagination'
import type FormData from '~/types/interfaces/page/order/FormData'

interface OrderFetchRequest extends FormData {}
interface OrderFetchResponse extends PaginationResponse<any> {}

export function apiOrderFetch(
  request: OrderFetchRequest
): Promise<OrderFetchResponse | null> {
  return apiGet('/orders', {
    ...request,
    skuIds: request.skus.map((v) => v.skuId),
    lineIds: request.lines.map((v) => v.lineId),
    groupIds: request.groups.map((v) => v.groupId),
    departmentIds: request.departments.map((v) => v.departmentId),
    storeIds: request.stores.map((v) => v.storeId),
    classIds: request.classes.map((v) => v.classId),
  })
}
