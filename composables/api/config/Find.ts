import type AdminAlertThreshold from '~/types/interfaces/database/AdminAlertThreshold'

export function apiConfigFind(id: number): Promise<AdminAlertThreshold | null> {
  return apiGet('/admin-alert-threshold/' + id.toString(), undefined)
}
