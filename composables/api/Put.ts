export function apiPut<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'PUT')
}
