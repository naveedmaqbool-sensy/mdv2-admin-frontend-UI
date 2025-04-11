export function apiOrderConditionsHistoryValueDownload(request: {
  id: number
  fileName: string
}) {
  return apiDownload('/order-conditions/history/value/download', request)
}
