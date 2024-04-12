import type AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import type AggregateTypes from '~/types/enums/AggregateTypes'
import type AggregateUnitTypes from '~/types/enums/AggregateUnitTypes'
import type SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import type StoreAggregateTypes from '~/types/enums/StoreAggregateTypes'
import type StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'
import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'

interface FormData {
  aggregateType: AggregateTypes
  aggregateUnitType: AggregateUnitTypes
  aggregateHorizontalAxisType: AggregateHorizontalAxisTypes
  skuAggregateUnitType: SkuAggregateUnitTypes
  storeAggregateType: StoreAggregateTypes
  storeAggregateUnitType: StoreAggregateUnitTypes
  targetDateFrom: Date
  targetDateTo: Date
  groups: GroupMaster[]
  departments: DepartmentMaster[]
  lines: LineMaster[]
  classes: ClassMaster[]
  storeGroups: StoreMaster[] // FIXME: rfukuma 店舗グループの扱いが変わる可能性があるため StoreMaster 参照とする
  stores: StoreMaster[]
}

export function factory(): FormData {
  return {
    aggregateType: AggregateTypes.OrderPty,
    aggregateUnitType: AggregateUnitTypes.Sku,
    aggregateHorizontalAxisType: AggregateHorizontalAxisTypes.Daily,
    skuAggregateUnitType: SkuAggregateUnitTypes.Sku,
    storeAggregateType: StoreAggregateTypes.All,
    storeAggregateUnitType: StoreAggregateUnitTypes.Area,
    targetDateFrom: new Date(),
    targetDateTo: new Date(),
    groups: [],
    departments: [],
    lines: [],
    classes: [],
    storeGroups: [],
    stores: [],
  }
}

export default FormData
