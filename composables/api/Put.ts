export function apiPut<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  errorMessages: ErrorMessages | null = null
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'PUT', undefined, errorMessages)
}
