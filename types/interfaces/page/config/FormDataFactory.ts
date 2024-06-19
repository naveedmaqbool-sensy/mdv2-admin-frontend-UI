import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type FormData from './FormData'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'

export default class implements FormData {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public monitoringType: MonitoringTypes | null = MonitoringTypes.OrderPty,
    public skuMonitoringUnitType: SkuMonitoringUnitTypes | null = SkuMonitoringUnitTypes.Sku,
    public storeMonitoringUnitType: StoreMonitoringUnitTypes | null = StoreMonitoringUnitTypes.All,
    public threshold: number = 0,

    // FIXME: rfukuma 型定義作ったら入れる
    public skus: any[] = [],
    public groups: GroupMaster[] = [],
    public departments: DepartmentMaster[] = [],
    public lines: LineMaster[] = [],
    public classes: ClassMaster[] = [],
    public storeGroups: StoreGroup[] = [],
    public stores: StoreMaster[] = []
  ) {}
}
