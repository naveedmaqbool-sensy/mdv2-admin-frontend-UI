export function apiOrderConditionsHistoryTargetSkuDownload(request: {
  id: number
}): Promise<{ downloadUrl: string } | null> {
  return apiPost('/order-conditions/history/target-sku/download', request)
}
