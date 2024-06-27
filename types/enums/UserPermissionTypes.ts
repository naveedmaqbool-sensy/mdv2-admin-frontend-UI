enum UserPermissionTypes {
  General = 1,
  Admin = 99,
}

namespace UserPermissionTypes {
  export function getName(type: UserPermissionTypes) {
    switch (type) {
      case UserPermissionTypes.General:
        return '一般'
      case UserPermissionTypes.Admin:
        return '管理者'
    }
  }

  export function getNameValues() {
    return [UserPermissionTypes.Admin, UserPermissionTypes.General].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default UserPermissionTypes
