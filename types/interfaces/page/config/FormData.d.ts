import type MonitoringHorizontalAxisTypes from '~/types/enums/MonitoringHorizontalAxisTypes'
import type MonitoringTypes from '~/types/enums/MonitoringTypes'
import type SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import type StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'

interface ConfigFormData {
  id: number | null
  name: string | null
  monitoringType: MonitoringTypes | null
  skuMonitoringUnitType: SkuMonitoringUnitTypes | null
  storeMonitoringUnitType: StoreMonitoringUnitTypes | null
  threshold: number

  // FIXME: rfukuma 型定義作ったら入れる
  skus: any[]
  groups: GroupMaster[]
  departments: DepartmentMaster[]
  lines: LineMaster[]
  classes: ClassMaster[]
  storeGroups: StoreGroup[]
  stores: StoreMaster[]
}

export default ConfigFormData
