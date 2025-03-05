import type OrderConditionsStatusTypes from '~/types/enums/OrderConditionsStatusTypes'
import type OrderConditionsUpsertStoreUnitTypes from '~/types/enums/OrderConditionsUpsertStoreUnitTypes'
import type OrderConditionsUpsertUnitTypes from '~/types/enums/OrderConditionsUpsertUnitTypes'
import type User from './User'
import type OrderConditionsMasterImportTarget from './OrderConditionsMasterImportTarget'
import type OrderConditionsMasterImportValue from './OrderConditionsMasterImportValue'

export default interface OrderConditionsMasterImport {
  id: number
  userId: number
  skuUnitType: OrderConditionsUpsertUnitTypes
  storeUnitType: OrderConditionsUpsertStoreUnitTypes
  statusType: OrderConditionsStatusTypes
  hasErrorFile: boolean

  // relations
  user?: User
  targets?: OrderConditionsMasterImportTarget[]
  values?: OrderConditionsMasterImportValue[]
}
