import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type FormData from './FormData'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import MonitoringHorizontalAxisTypes from '~/types/enums/MonitoringHorizontalAxisTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'

export default class implements FormData {
  aggregateType!: MonitoringTypes | null
  aggregateHorizontalAxisType!: MonitoringHorizontalAxisTypes | null
  skuAggregateUnitType!: SkuMonitoringUnitTypes | null
  skuAggregateRangeType!: SkuMonitoringUnitTypes | null

  storeAggregateUnitType!: StoreMonitoringUnitTypes | null
  storeAggregateRangeType!: StoreMonitoringUnitTypes | null

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
    aggregateType: MonitoringTypes | null = MonitoringTypes.DefectRate,
    aggregateHorizontalAxisType: MonitoringHorizontalAxisTypes | null = MonitoringHorizontalAxisTypes.Daily,
    skuAggregateUnitType: SkuMonitoringUnitTypes | null = SkuMonitoringUnitTypes.Sku,
    skuAggregateRangeType: SkuMonitoringUnitTypes | null = null,
    storeAggregateUnitType: StoreMonitoringUnitTypes | null = StoreMonitoringUnitTypes.All,
    storeAggregateRangeType: StoreMonitoringUnitTypes | null = null,
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
