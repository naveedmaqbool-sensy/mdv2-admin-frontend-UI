import type MonitoingFormData from '~/types/interfaces/page/monitoring/FormData'

export interface ApiMonitoringDetailCsvEportRequest extends MonitoingFormData {
  targetId: string
  searchText: string
}

export function apiMonitoringDetailCsvEport(
  request: ApiMonitoringDetailCsvEportRequest
) {
  return apiDownload('/monitoring/detail/csv-export', request)
}
