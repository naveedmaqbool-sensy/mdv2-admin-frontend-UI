import type { ResponseType } from './Base'

export function apiPost<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  responseType: ResponseType = undefined
): Promise<ResponseT | null> {
  return apiBase(endpoint, request, 'POST', responseType)
}
