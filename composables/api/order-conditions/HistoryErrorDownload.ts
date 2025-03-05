export function apiOrderConditionsHistoryErrorDownload(request: {
  id: number
}): Promise<{ downloadUrl: string } | null> {
  return apiPost('/order-conditions/history/error/download', request)
}
