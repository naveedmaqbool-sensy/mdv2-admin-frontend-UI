import type User from '~/types/interfaces/database/User'

export function apiUserSave(request: User) {
  const storeIds = request.storeMasters!.map((v) => {
    return v.storeId
  })
  const groupIds = request.groupMasters!.map((v) => {
    return v.groupId
  })

  return apiPost<User, User>('/user', {
    ...request,
    ...{
      storeIds,
      groupIds,
    },
  })
}
