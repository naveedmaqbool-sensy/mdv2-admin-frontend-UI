import type DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import type OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import type RoundUpDownTypes from '~/types/enums/RoundUpTypes'
import type StoreMaster from './SensyCloud/StoreMaster'
import type GroupMaster from './SensyCloud/GroupMaster'
import type DepartmentMaster from './SensyCloud/DepartmentMaster'
import type LineMaster from './SensyCloud/LineMaster'
import type ClassMaster from './SensyCloud/ClassMaster'
import type StoreSkuMaster from './SensyCloud/StoreSkuMaster'

export default interface OrderConditionsMaster {
  id: number
  storeId: string
  skuId: string
  orderConditionStartDate: Date | string
  orderConditionEndDate: Date | string
  orderConditionPriority: number
  janCode: string
  orderingMethod: OrderingMethodTypes
  leadTimeOnMonday: number | null
  leadTimeOnTuesday: number | null
  leadTimeOnWednesday: number | null
  leadTimeOnThursday: number | null
  leadTimeOnFriday: number | null
  leadTimeOnSaturday: number | null
  leadTimeOnSunday: number | null
  orderLot: number | null
  roundUpDownDefinition: RoundUpDownTypes | null
  minimumOrderQty: number | null
  cutDate: Date | string | null
  deliveryType: DeliveryDateTypes | null
  displayStockQty: number | null
  displayLimitQty: number | null

  // relations
  groupMaster?: GroupMaster
  departmentMaster?: DepartmentMaster
  lineMaster?: LineMaster
  classMaster?: ClassMaster
  storeMaster?: StoreMaster
  storeSkuMaster?: StoreSkuMaster
}
