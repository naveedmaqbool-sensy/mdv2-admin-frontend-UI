import { addDays, endOfWeek, startOfWeek } from 'date-fns'
import type FormData from './FormData'
import type StoreMaster from '../../database/SensyCloud/StoreMaster'
import type ClassMaster from '../../database/SensyCloud/ClassMaster'
import type LineMaster from '../../database/SensyCloud/LineMaster'
import type DepartmentMaster from '../../database/SensyCloud/DepartmentMaster'
import type GroupMaster from '../../database/SensyCloud/GroupMaster'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type StoreGroup from '../../database/SensyCloud/StoreGroup'

export default class FormDataFactory implements FormData {
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
    public perPage: number = 10,
    from: Date | null = null,
    to: Date | null = null
  ) {
    this.from = from || addDays(startOfWeek(new Date()), 1)
    this.to = to || addDays(endOfWeek(new Date()), 1)
  }
}
