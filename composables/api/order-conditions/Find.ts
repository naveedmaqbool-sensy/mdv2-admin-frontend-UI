import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'

interface OrderConditionsFindRequest {
  orderConditionId: number
}

export class OrderConditionsFindRequestFactory
  implements OrderConditionsFindRequest
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(public orderConditionId: number = 0) {}
}

export function apiOrderConditionsFind(
  request: OrderConditionsFindRequest
): Promise<OrderConditionsMaster | null> {
  return apiGet('/order-conditions/find', request)
}
