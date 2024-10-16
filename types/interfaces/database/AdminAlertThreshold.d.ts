import type MonitoringTypes from '~/types/enums/MonitoringTypes'
import type SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import type StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type GroupMaster from './SensyCloud/GroupMaster'
import type DepartmentMaster from './SensyCloud/DepartmentMaster'
import type LineMaster from './SensyCloud/LineMaster'
import type ClassMaster from './SensyCloud/ClassMaster'
import type StoreGroup from './SensyCloud/StoreGroup'
import type StoreMaster from './SensyCloud/StoreMaster'

interface AdminAlertThreshold {
  id: number
  name: string
  monitoringType: MonitoringTypes
  skuMonitoringUnitType: SkuMonitoringUnitTypes
  storeMonitoringUnitType: StoreMonitoringUnitTypes
  threshold: number
  isAllTarget: boolean

  skus?: any[]
  groups?: GroupMaster[]
  departments?: DepartmentMaster[]
  lines?: LineMaster[]
  classes?: ClassMaster[]
  storeGroups?: StoreGroup[]
  stores?: StoreMaster[]

  adminAlertThresholdSkus?: any[]
  adminAlertThresholdGroups?: any[]
  adminAlertThresholdDepartments?: any[]
  adminAlertThresholdLines?: any[]
  adminAlertThresholdClasses?: any[]
  adminAlertThresholdStores?: any[]
}

export default AdminAlertThreshold
