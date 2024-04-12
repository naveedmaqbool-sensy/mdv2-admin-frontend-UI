import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type FormData from './FormData'
import AggregateTypes from '~/types/enums/AggregateTypes'
import AggregateUnitTypes from '~/types/enums/AggregateUnitTypes'
import AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import StoreAggregateTypes from '~/types/enums/StoreAggregateTypes'
import StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'

export default class implements FormData {
  aggregateType!: AggregateTypes
  aggregateUnitType!: AggregateUnitTypes
  aggregateHorizontalAxisType!: AggregateHorizontalAxisTypes
  skuAggregateUnitType!: SkuAggregateUnitTypes
  storeAggregateType!: StoreAggregateTypes
  storeAggregateUnitType!: StoreAggregateUnitTypes
  targetDateFrom!: Date
  targetDateTo!: Date
  groups!: GroupMaster[]
  departments!: DepartmentMaster[]
  lines!: LineMaster[]
  classes!: ClassMaster[]
  storeGroups!: StoreMaster[]
  stores!: StoreMaster[]

  constructor(
    aggregateType: AggregateTypes = AggregateTypes.OrderPty,
    aggregateUnitType: AggregateUnitTypes = AggregateUnitTypes.Sku,
    aggregateHorizontalAxisType: AggregateHorizontalAxisTypes = AggregateHorizontalAxisTypes.Daily,
    skuAggregateUnitType: SkuAggregateUnitTypes = SkuAggregateUnitTypes.Sku,
    storeAggregateType: StoreAggregateTypes = StoreAggregateTypes.All,
    storeAggregateUnitType: StoreAggregateUnitTypes = StoreAggregateUnitTypes.Store,
    targetDateFrom: Date = new Date(),
    targetDateTo: Date = new Date(),
    groups: GroupMaster[] = [],
    departments: DepartmentMaster[] = [],
    lines: LineMaster[] = [],
    classes: ClassMaster[] = [],
    storeGroups: StoreMaster[] = [],
    stores: StoreMaster[] = []
  ) {
    this.aggregateType = aggregateType
    this.aggregateUnitType = aggregateUnitType
    this.aggregateHorizontalAxisType = aggregateHorizontalAxisType
    this.skuAggregateUnitType = skuAggregateUnitType
    this.storeAggregateType = storeAggregateType
    this.storeAggregateUnitType = storeAggregateUnitType
    this.targetDateFrom = targetDateFrom
    this.targetDateTo = targetDateTo
    this.groups = groups
    this.departments = departments
    this.lines = lines
    this.classes = classes
    this.storeGroups = storeGroups
    this.stores = stores
  }
}
