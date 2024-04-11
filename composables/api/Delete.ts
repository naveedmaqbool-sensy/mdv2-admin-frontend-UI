export function apiDelete<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'DELETE')
}
