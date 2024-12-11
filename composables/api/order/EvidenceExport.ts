import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

interface OrderEvidenceExportRequest {
  from: Date
  to: Date
  store: StoreMaster
  sku: any
}

export function apiOrderEvidenceExport(request: OrderEvidenceExportRequest) {
  return apiDownload('/order/evidence-export', {
    ...request,
    storeId: request.store.storeId,
    skuId: request.sku.skuId,
  })
}
