import type MonitoringTypes from '~/types/enums/MonitoringTypes'
import type SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import type StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type AdminAlertThreshold from './AdminAlertThreshold'
import type AdminAlertTarget from './AdminAlertTarget'

interface AdminAlert {
  id: number
  objectiveDate: Date
  name: string
  monitoringType: MonitoringTypes
  skuMonitoringUnitType: SkuMonitoringUnitTypes
  storeMonitoringUnitType: StoreMonitoringUnitTypes
  threshold: number
  adminAlertThresholdId: number

  adminAlertThreshold?: AdminAlertThreshold
  adminAlertTargets?: AdminAlertTarget[]
}

export default AdminAlert
