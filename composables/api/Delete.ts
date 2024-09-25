export function apiDelete<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  errorMessages: ErrorMessages | null = null
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'DELETE', undefined, errorMessages)
}
