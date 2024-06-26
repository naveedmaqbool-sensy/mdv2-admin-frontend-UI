import type UserPermissionTypes from '~/types/enums/UserPermissionTypes'
import type GroupMaster from './SensyCloud/GroupMaster'
import type StoreMaster from './SensyCloud/StoreMaster'

export default interface User {
  id: number
  code: string // 社員番号
  name: string // 氏名
  email: string // メアド
  permission: UserPermissionTypes
  isValid: boolean
  groupMasters?: GroupMaster[]
  storeMasters?: StoreMaster[]
}
