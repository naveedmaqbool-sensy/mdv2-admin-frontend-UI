import type SkuAlertTypes from '../enums/SkuAlertTypes'
import type StoreSkuMaster from './SensyCloud/StoreSkuMaster'
import type Sku from './Sku'

interface SkuAlert {
  id: string
  date: Date | string
  storeId: string
  skuId: string
  skuAlertType: SkuAlertTypes

  storeSkuMaster?: StoreSkuMaster
}

export default SkuAlert
