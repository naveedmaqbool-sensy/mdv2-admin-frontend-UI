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
  aggregateType!: AggregateTypes | null
  aggregateUnitType!: AggregateUnitTypes | null
  aggregateHorizontalAxisType!: AggregateHorizontalAxisTypes | null
  skuAggregateUnitType!: SkuAggregateUnitTypes | null
  storeAggregateType!: StoreAggregateTypes | null
  storeAggregateUnitType!: StoreAggregateUnitTypes | null
  targetDateFrom!: Date | null
  targetDateTo!: Date | null
  groups!: GroupMaster[]
  departments!: DepartmentMaster[]
  lines!: LineMaster[]
  classes!: ClassMaster[]
  storeGroups!: StoreMaster[]
  stores!: StoreMaster[]

  constructor(
    aggregateType: AggregateTypes | null = null,
    aggregateUnitType: AggregateUnitTypes | null = null,
    aggregateHorizontalAxisType: AggregateHorizontalAxisTypes | null = null,
    skuAggregateUnitType: SkuAggregateUnitTypes | null = null,
    storeAggregateType: StoreAggregateTypes | null = null,
    storeAggregateUnitType: StoreAggregateUnitTypes | null = null,
    targetDateFrom: Date | null = null,
    targetDateTo: Date | null = null,
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
