export function apiOrderConditionsUpsertExecute(request: {
  id: number
}): Promise<void | null> {
  return apiPost('/order-conditions/upsert-execute', request)
}
