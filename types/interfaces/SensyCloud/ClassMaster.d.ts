import type DepartmentMaster from './DepartmentMaster'
import type GroupMaster from './GroupMaster'
import type LineMaster from './LineMaster'

interface ClassMaster {
  classId: string
  className: string
  groupId: string
  departmentId: string
  lineId: string
  departmentId: string

  group?: GroupMaster
  department?: DepartmentMaster
  line?: LineMaster
}

export default ClassMaster
