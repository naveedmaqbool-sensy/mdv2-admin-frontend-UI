import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'
import type ConfigFormData from '~/types/interfaces/page/config/FormData'

export function apiConfigEdit(
  request: ConfigFormData
): Promise<AdminAlertThreshold | null> {
  return apiPut('/admin-alert-threshold', request)
}
