interface Request {}
type Response = any[]

export function apiEffectivenessFetch(
  request: Request
): Promise<Response | null> {
  return apiGet('/effectiveness', request)
}
