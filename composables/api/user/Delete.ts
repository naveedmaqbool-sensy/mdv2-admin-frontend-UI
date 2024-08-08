export function apiUserDelete(userId: number) {
  return apiDelete('/user', {
    id: userId,
  })
}
