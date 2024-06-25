import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'
import type ConfigFormData from '~/types/interfaces/page/config/FormData'

export function apiConfigCreate(
  request: ConfigFormData
): Promise<AdminAlertThreshold | null> {
  return apiPost('/admin-alert-threshold', request)
}
