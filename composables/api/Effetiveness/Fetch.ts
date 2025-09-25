interface Request {
  from: Date
  to: Date
  skuId: string
  storeId: string
}
type Response = {
  errorMessage: string
  records: {
    name: string
    values: {
      row: string
      amount: number
    }[]
  }[]
}

export function apiEffectivenessFetch(
  request: Request
): Promise<Response | null> {
  return apiGet('/effectiveness', request)
}
