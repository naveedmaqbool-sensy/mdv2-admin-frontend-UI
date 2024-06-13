import type FormData from '~/types/interfaces/page/monitoring/FormData'

interface ApiMonitoringFetchRequest extends FormData {}
interface ApiMonitoringFetchResponse {
  headers: string[]
  rows: string[][]
}

export function apiMonitoringFetch(
  request: ApiMonitoringFetchRequest
): Promise<ApiMonitoringFetchResponse | null> {
  return apiPost('/monitoring', request)
}
