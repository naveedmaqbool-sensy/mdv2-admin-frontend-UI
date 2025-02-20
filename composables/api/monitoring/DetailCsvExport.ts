import type MonitoringFormData from '~/types/interfaces/page/monitoring/FormData'

export interface ApiMonitoringDetailCsvExportRequest
  extends MonitoringFormData {
  targetId: string
  searchText: string
}

export function apiMonitoringDetailCsvExport(
  request: ApiMonitoringDetailCsvExportRequest
) {
  return apiDownload('/monitoring/detail/csv-export', request)
}
