import type MonitoingFormData from '~/types/interfaces/page/monitoring/FormData'

interface ApiMonitoringCsvExportRequest extends MonitoingFormData {}

export function apiMonitoringCsvExport(
  request: ApiMonitoringCsvExportRequest
): Promise<boolean | null> {
  return apiDownload('/monitoring/csv-export', request)
}
