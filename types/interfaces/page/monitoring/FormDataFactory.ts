import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type FormData from './FormData'
import AggregateTypes from '~/types/enums/AggregateTypes'
import AggregateHorizontalAxisTypes from '~/types/enums/AggregateHorizontalAxisTypes'
import SkuAggregateUnitTypes from '~/types/enums/SkuAggregateUnitTypes'
import StoreAggregateUnitTypes from '~/types/enums/StoreAggregateUnitTypes'

export default class implements FormData {
  aggregateType!: AggregateTypes | null
  aggregateHorizontalAxisType!: AggregateHorizontalAxisTypes | null
  skuAggregateUnitType!: SkuAggregateUnitTypes | null
  skuAggregateRangeType!: SkuAggregateUnitTypes | null

  storeAggregateUnitType!: StoreAggregateUnitTypes | null
  storeAggregateRangeType!: StoreAggregateUnitTypes | null

  targetDateFrom!: Date | null
  targetDateTo!: Date | null
  // FIXME: rfukuma 型定義作ったら入れる
  skus!: any[]
  groups!: GroupMaster[]
  departments!: DepartmentMaster[]
  lines!: LineMaster[]
  classes!: ClassMaster[]
  storeGroups!: StoreGroup[]
  stores!: StoreMaster[]

  constructor(
    aggregateType: AggregateTypes | null = AggregateTypes.DefectRate,
    aggregateHorizontalAxisType: AggregateHorizontalAxisTypes | null = AggregateHorizontalAxisTypes.Daily,
    skuAggregateUnitType: SkuAggregateUnitTypes | null = SkuAggregateUnitTypes.Sku,
    skuAggregateRangeType: SkuAggregateUnitTypes | null = null,
    storeAggregateUnitType: StoreAggregateUnitTypes | null = StoreAggregateUnitTypes.All,
    storeAggregateRangeType: StoreAggregateUnitTypes | null = null,
    targetDateFrom: Date | null = new Date(),
    targetDateTo: Date | null = new Date(),
    // FIXME: rfukuma 型定義作ったら入れる
    skus: any[] = [],
    groups: GroupMaster[] = [],
    departments: DepartmentMaster[] = [],
    lines: LineMaster[] = [],
    classes: ClassMaster[] = [],
    storeGroups: StoreGroup[] = [],
    stores: StoreMaster[] = []
  ) {
    this.aggregateType = aggregateType
    this.aggregateHorizontalAxisType = aggregateHorizontalAxisType
    this.skuAggregateUnitType = skuAggregateUnitType
    this.skuAggregateRangeType = skuAggregateRangeType
    this.storeAggregateUnitType = storeAggregateUnitType
    this.storeAggregateRangeType = storeAggregateRangeType
    this.targetDateFrom = targetDateFrom
    this.targetDateTo = targetDateTo
    this.skus = skus
    this.groups = groups
    this.departments = departments
    this.lines = lines
    this.classes = classes
    this.storeGroups = storeGroups
    this.stores = stores
  }
}
