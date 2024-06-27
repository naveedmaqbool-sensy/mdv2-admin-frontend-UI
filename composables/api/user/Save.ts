import type User from '~/types/interfaces/database/User'

export function apiUserSave(request: User) {
  return apiPost<User, User>('/user', request)
}
