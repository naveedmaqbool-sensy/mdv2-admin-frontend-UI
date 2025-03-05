export function apiOrderConditionsHistoryTargetStoreDownload(request: {
  id: number
}): Promise<{ downloadUrls: string[] } | null> {
  return apiPost('/order-conditions/history/target-store/download', request)
}
