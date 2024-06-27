import type User from '~/types/interfaces/database/User'

export function apiUserFind(userId: number) {
  return apiGet<null, User>('/user/' + userId.toString(), null)
}
