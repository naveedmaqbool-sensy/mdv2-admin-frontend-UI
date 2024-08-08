import type MonitoingFormData from '~/types/interfaces/page/monitoring/FormData'

interface ApiMonitoringFetchRequest extends MonitoingFormData {}
interface ApiMonitoringFetchResponse {
  headers: string[]
  rows: string[][]
  total: number
}

export function apiMonitoringFetch(
  request: ApiMonitoringFetchRequest
): Promise<ApiMonitoringFetchResponse | null> {
  return apiPost('/monitoring', request)
}
