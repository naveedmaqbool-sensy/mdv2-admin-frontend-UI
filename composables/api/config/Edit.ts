import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'
import type FormData from '~/types/interfaces/page/config/FormData'

export function apiConfigEdit(
  request: FormData
): Promise<AdminAlertThreshold | null> {
  return apiPut('/admin-alert-threshold', request)
}
