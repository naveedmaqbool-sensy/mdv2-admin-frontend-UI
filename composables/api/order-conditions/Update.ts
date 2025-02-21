import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'

interface OrderConditionsUpdateRequest extends OrderConditionsMaster {}

export function apiOrderConditionsUpdate(
  request: OrderConditionsUpdateRequest
): Promise<OrderConditionsMaster | null> {
  return apiPost('/order-conditions/update', request)
}
