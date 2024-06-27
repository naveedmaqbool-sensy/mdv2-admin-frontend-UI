import type GroupMaster from './SensyCloud/GroupMaster'
import type StoreMaster from './SensyCloud/StoreMaster'
import type User from './User'
import UserPermissionTypes from '~/types/enums/UserPermissionTypes'

export default class UserFactory implements User {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public id: number | null = null,
    public code: string = '',
    public name: string = '',
    public email: string = '',
    public permission: UserPermissionTypes = UserPermissionTypes.General,
    public isValid: boolean = true,
    public groupMasters: GroupMaster[] | undefined = [],
    public storeMasters: StoreMaster[] | undefined = []
  ) {}
}
