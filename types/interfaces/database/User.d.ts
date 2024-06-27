import type UserPermissionTypes from '~/types/enums/UserPermissionTypes'
import type GroupMaster from './SensyCloud/GroupMaster'
import type StoreMaster from './SensyCloud/StoreMaster'

export default interface User {
  id: number | null
  code: string // 社員番号
  name: string
  email: string
  password?: string
  permission: UserPermissionTypes
  isValid: boolean
  groupMasters?: GroupMaster[]
  storeMasters?: StoreMaster[]
}
