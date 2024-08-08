import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type MonitoingFormData from './FormData'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import MonitoringHorizontalAxisTypes from '~/types/enums/MonitoringHorizontalAxisTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'

export default class MonitoringFormDataFactory implements MonitoingFormData {
  monitoringType!: MonitoringTypes | null
  monitoringHorizontalAxisType!: MonitoringHorizontalAxisTypes | null
  skuMonitoringUnitType!: SkuMonitoringUnitTypes | null
  skuMonitoringRangeType!: SkuMonitoringUnitTypes | null

  storeMonitoringUnitType!: StoreMonitoringUnitTypes | null
  storeMonitoringRangeType!: StoreMonitoringUnitTypes | null

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
  page!: number
  perPage!: number

  constructor(
    monitoringType: MonitoringTypes | null = MonitoringTypes.OrderPty,
    monitoringHorizontalAxisType: MonitoringHorizontalAxisTypes | null = MonitoringHorizontalAxisTypes.Daily,
    skuMonitoringUnitType: SkuMonitoringUnitTypes | null = SkuMonitoringUnitTypes.Sku,
    skuMonitoringRangeType: SkuMonitoringUnitTypes | null = null,
    storeMonitoringUnitType: StoreMonitoringUnitTypes | null = StoreMonitoringUnitTypes.All,
    storeMonitoringRangeType: StoreMonitoringUnitTypes | null = null,
    targetDateFrom: Date | null = new Date(),
    targetDateTo: Date | null = new Date(),
    // FIXME: rfukuma 型定義作ったら入れる
    skus: any[] = [],
    groups: GroupMaster[] = [],
    departments: DepartmentMaster[] = [],
    lines: LineMaster[] = [],
    classes: ClassMaster[] = [],
    storeGroups: StoreGroup[] = [],
    stores: StoreMaster[] = [],
    page: number = 1,
    perPage: number = 100
  ) {
    this.monitoringType = monitoringType
    this.monitoringHorizontalAxisType = monitoringHorizontalAxisType
    this.skuMonitoringUnitType = skuMonitoringUnitType
    this.skuMonitoringRangeType = skuMonitoringRangeType
    this.storeMonitoringUnitType = storeMonitoringUnitType
    this.storeMonitoringRangeType = storeMonitoringRangeType
    this.targetDateFrom = targetDateFrom
    this.targetDateTo = targetDateTo
    this.skus = skus
    this.groups = groups
    this.departments = departments
    this.lines = lines
    this.classes = classes
    this.storeGroups = storeGroups
    this.stores = stores
    this.page = page
    this.perPage = perPage
  }
}
