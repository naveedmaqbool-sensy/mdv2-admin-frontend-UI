import type FormData from '~/types/interfaces/page/alert/FormData'

interface AlertGetResponse {
  skuAlertCount: number
  adminAlertCount: number
}

export function apiAlertGet(
  request: FormData
): Promise<AlertGetResponse | null> {
  return apiGet('/alert/summary', request)
}
