import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'
import type { PaginationRequest } from '../../common/Pagination'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type Sortable from '../../common/Sortable'

export default interface OrderConditionsFormData
  extends PaginationRequest,
    Sortable {
  from: Date | null
  to: Date | null
  skuMonitoringUnitType: SkuMonitoringUnitTypes | null
  storeMonitoringUnitType: StoreMonitoringUnitTypes

  skus: any[]
  groups: GroupMaster[]
  departments: DepartmentMaster[]
  lines: LineMaster[]
  classes: ClassMaster[]
  stores: StoreMaster[]
  storeGroups: StoreGroup[]
}
