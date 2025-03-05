import type MonitoringFormData from '~/types/interfaces/page/monitoring/FormData'

interface ApiMonitoringCsvExportRequest extends MonitoringFormData {}

export function apiMonitoringCsvExport(
  request: ApiMonitoringCsvExportRequest
): Promise<boolean | null> {
  return apiDownload('/monitoring/csv-export', request)
}
