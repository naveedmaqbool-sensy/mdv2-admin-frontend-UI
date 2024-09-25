export function apiGet<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  errorMessages: ErrorMessages | null = null
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'GET', undefined, errorMessages)
}
