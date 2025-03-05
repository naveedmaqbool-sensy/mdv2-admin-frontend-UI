import type ClassMaster from './ClassMaster'
import type DepartmentMaster from './DepartmentMaster'
import type GroupMaster from './GroupMaster'
import type StoreMaster from './StoreMaster'

interface StoreSkuMaster {
  storeId: string
  groupId: string
  departmentId: string
  lineId: string
  classId: string
  skuId: string
  janCode: string
  skuName: string
  regularPrice: number
  cost: number

  // relations
  groupMaster?: GroupMaster
  departmentMaster?: DepartmentMaster
  lineMaster?: LineMaster
  classMaster?: ClassMaster
  storeMaster?: StoreMaster
}

export default StoreSkuMaster
