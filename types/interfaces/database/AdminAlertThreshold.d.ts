import type MonitoringTypes from '~/types/enums/MonitoringTypes'
import type SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import type StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'

interface AdminAlertThreshold {
  name: string
  monitoringType: MonitoringTypes
  skuMonitoringUnitType: SkuMonitoringUnitTypes
  storeMonitoringUnitType: StoreMonitoringUnitTypes
  threshold: number
}

export default AdminAlertThreshold
