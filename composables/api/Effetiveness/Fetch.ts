import type OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import type TargetDateRangeTypes from '~/types/enums/TargetDateRangeTypes'

interface Request {
  from: Date
  to: Date
  skuId: string
  storeId: string
  targetDateRangeType: TargetDateRangeTypes
}
export type EffectivenessFetchResponse = {
  errorMessage: string
  records: {
    objectiveDate: string
    orderingMethod: OrderingMethodTypes
    stockQty: number
    salesQty: number
    arrivalQty: number
    orderQty: number
  }[]
  orderingMethodRecords: {
    orderingMethod: OrderingMethodTypes
    averageStockQty: number
    noStockCount: number
    inventoryTurnoverRate: number
    inventoryTurnoverDays: number
  }[]
}

export function apiEffectivenessFetch(
  request: Request
): Promise<EffectivenessFetchResponse | null> {
  return apiGet('/effectiveness', request)
}
