import type MonitoringFormData from '~/types/interfaces/page/monitoring/FormData'

interface ApiMonitoringFetchRequest extends MonitoringFormData {}
interface ApiMonitoringFetchResponse {
  headers: string[]
  rows: { [key: string]: string }[]
  total: number
}

export function apiMonitoringFetch(
  request: ApiMonitoringFetchRequest
): Promise<ApiMonitoringFetchResponse | null> {
  return apiPost('/monitoring', request)
}
