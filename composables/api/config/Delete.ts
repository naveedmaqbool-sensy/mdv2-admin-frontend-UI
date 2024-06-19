import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'

export function apiConfigDelete(
  id: number
): Promise<AdminAlertThreshold | null> {
  return apiDelete('/admin-alert-threshold/' + id, undefined)
}
