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
  name!: string | null
  monitoringType!: MonitoringTypes | null
  monitoringHorizontalAxisType!: MonitoringHorizontalAxisTypes | null
  skuMonitoringUnitType!: SkuMonitoringUnitTypes | null
  storeMonitoringUnitType!: StoreMonitoringUnitTypes | null
  threshold!: number
  // FIXME: rfukuma 型定義作ったら入れる
  skus!: any[]
  groups!: GroupMaster[]
  departments!: DepartmentMaster[]
  lines!: LineMaster[]
  classes!: ClassMaster[]
  storeGroups!: StoreGroup[]
  stores!: StoreMaster[]

  constructor(
    name: string | null = null,
    monitoringType: MonitoringTypes | null = MonitoringTypes.OrderPty,
    skuMonitoringUnitType: SkuMonitoringUnitTypes | null = SkuMonitoringUnitTypes.Sku,
    storeMonitoringUnitType: StoreMonitoringUnitTypes | null = StoreMonitoringUnitTypes.All,
    threshold: number = 0,

    // FIXME: rfukuma 型定義作ったら入れる
    skus: any[] = [],
    groups: GroupMaster[] = [],
    departments: DepartmentMaster[] = [],
    lines: LineMaster[] = [],
    classes: ClassMaster[] = [],
    storeGroups: StoreGroup[] = [],
    stores: StoreMaster[] = []
  ) {
    this.name = name
    this.monitoringType = monitoringType
    this.skuMonitoringUnitType = skuMonitoringUnitType
    this.storeMonitoringUnitType = storeMonitoringUnitType
    this.threshold = threshold
    this.skus = skus
    this.groups = groups
    this.departments = departments
    this.lines = lines
    this.classes = classes
    this.storeGroups = storeGroups
    this.stores = stores
  }
}
