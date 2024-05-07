import type AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import type AggregateTypes from '~/types/enums/AggregateTypes'
import type SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import type StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'
import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'

interface FormData {
  aggregateType: AggregateTypes | null
  aggregateHorizontalAxisType: AggregateHorizontalAxisTypes | null
  skuAggregateUnitType: SkuAggregateUnitTypes | null
  skuAggregateRangeType: SkuAggregateUnitTypes | null
  storeAggregateUnitType: StoreAggregateUnitTypes | null
  storeAggregateRangeType: StoreAggregateUnitTypes | null
  targetDateFrom: Date | null
  targetDateTo: Date | null
  // FIXME: rfukuma 型定義作ったら入れる
  skus: any[]
  groups: GroupMaster[]
  departments: DepartmentMaster[]
  lines: LineMaster[]
  classes: ClassMaster[]
  storeGroups: StoreGroup[]
  stores: StoreMaster[]
}

export default FormData
