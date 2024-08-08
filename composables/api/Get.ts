export function apiGet<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'GET')
}
