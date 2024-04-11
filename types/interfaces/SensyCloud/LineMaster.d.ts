import type DepartmentMaster from './DepartmentMaster'
import type GroupMaster from './GroupMaster'

interface LineMaster {
  lineId: string
  lineName: string
  groupId: string
  departmentId: string

  group?: GroupMaster
  department?: DepartmentMaster
}

export default LineMaster
