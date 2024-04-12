import type GroupMaster from './GroupMaster'

interface DepartmentMaster {
  groupId: string
  departmentId: string
  departmentName: string

  group?: GroupMaster
}

export default DepartmentMaster
