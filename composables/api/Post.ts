import type { ResponseType } from './Base'

export function apiPost<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  responseType: ResponseType = undefined,
  errorMessages: ErrorMessages | null = null,
  fileRequest: { [name: string]: File } | null = null
): Promise<ResponseT | null> {
  return apiBase(
    endpoint,
    request,
    'POST',
    responseType,
    errorMessages,
    fileRequest
  )
}
