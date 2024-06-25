import type MonitoringTypes from '~/types/enums/MonitoringTypes'
import type SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import type StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type AdminAlertThreshold from './AdminAlertThreshold'

interface AdminAlertTarget {
  id: number
  adminAlertId: number
  storeId: string | null
  skuId: string | null
  groupId: string | null
  departmentId: string | null
  lineId: string | null
  classId: string | null

  adminAlert?: AdminAlert
}

export default AdminAlertTarget
