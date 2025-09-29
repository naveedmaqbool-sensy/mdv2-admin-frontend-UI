import type OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'

interface Request {
  from: Date
  to: Date
  skuId: string
  storeId: string
}
export type EffectivenessFetchResponse = {
  errorMessage: string
  records: {
    objectiveDate: string
    orderingMethod: OrderingMethodTypes
    stockQty: number
    salesQty: number
    arrivalQty: number
  }[]
}

export function apiEffectivenessFetch(
  request: Request
): Promise<EffectivenessFetchResponse | null> {
  return apiGet('/effectiveness', request)
}
