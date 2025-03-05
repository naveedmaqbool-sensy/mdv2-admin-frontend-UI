import type Sortable from '~/types/interfaces/common/Sortable'

interface OrderConditionsCsvExportRequest extends Sortable {
  storeIds: string[]
  skuIds: string[]
  groupIds: string[]
  departmentIds: string[]
  lineIds: string[]
  classIds: string[]
  from: Date | string | null
  to: Date | string | null
}

export function apiOrderConditionsCsvExport(
  request: OrderConditionsCsvExportRequest
) {
  return apiDownload('/order-conditions/csv-export', request)
}
