import { startOfDay } from 'date-fns'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'
import type OrderConditionsFormData from './FormData'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'

export default class implements OrderConditionsFormData {
  public from!: Date
  public to!: Date

  public constructor(
    public skuMonitoringUnitType: SkuMonitoringUnitTypes | null = null,
    public storeMonitoringUnitType: StoreMonitoringUnitTypes = StoreMonitoringUnitTypes.All,
    public skus: any[] = [],
    public groups: GroupMaster[] = [],
    public departments: DepartmentMaster[] = [],
    public lines: LineMaster[] = [],
    public classes: ClassMaster[] = [],
    public stores: StoreMaster[] = [],
    public storeGroups: StoreGroup[] = [],
    public page: number = 1,
    public perPage: number = 20,
    from: Date | null = null,
    to: Date | null = null
  ) {
    this.from = from || startOfDay(new Date())
    this.to = to || startOfDay(new Date())
  }
}
