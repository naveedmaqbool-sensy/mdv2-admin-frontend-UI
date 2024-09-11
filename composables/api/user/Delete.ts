export function apiUserDelete(userId: number) {
  return apiDelete<{ id: number }, boolean>('/user', {
    id: userId,
  })
}
