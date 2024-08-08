import type AlertFormData from '~/types/interfaces/page/alert/FormData'

interface AlertGetResponse {
  skuAlertCount: number
  adminAlertCount: number
}

export function apiAlertGet(
  request: AlertFormData
): Promise<AlertGetResponse | null> {
  return apiGet('/alert/summary', request)
}
