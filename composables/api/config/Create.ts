import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'
import type FormData from '~/types/interfaces/page/config/FormData'

export function apiConfigCreate(
  request: FormData
): Promise<AdminAlertThreshold | null> {
  return apiPost('/admin-alert-threshold', request)
}
