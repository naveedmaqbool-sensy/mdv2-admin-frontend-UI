interface OrderUpdateRequest {
  id: number
  actualOrderQty: number
}

export function apiOrderUpdate(request: OrderUpdateRequest) {
  return apiPut('/order', request)
}
