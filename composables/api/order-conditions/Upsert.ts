import DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import OrderConditionsUpsertStoreUnitTypes from '~/types/enums/OrderConditionsUpsertStoreUnitTypes'
import OrderConditionsUpsertUnitTypes from '~/types/enums/OrderConditionsUpsertUnitTypes'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import RoundUpDownTypes from '~/types/enums/RoundUpTypes'
import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'

export interface OrderConditionsUpsertTarget
  extends Pick<
    OrderConditionsMaster,
    | 'orderConditionStartDate'
    | 'orderConditionEndDate'
    | 'orderConditionPriority'
    | 'orderingMethod'
    | 'leadTimeOnMonday'
    | 'leadTimeOnTuesday'
    | 'leadTimeOnWednesday'
    | 'leadTimeOnThursday'
    | 'leadTimeOnFriday'
    | 'leadTimeOnSaturday'
    | 'leadTimeOnSunday'
    | 'orderLot'
    | 'roundUpDownDefinition'
    | 'minimumOrderQty'
    | 'cutDate'
    | 'deliveryType'
    | 'displayStockQty'
    | 'displayLimitQty'
  > {
  targetStoreCsvFiles: {
    file: File
    lineLength: number
  }[]
}

export class OrderConditionsUpsertTargetFactory
  implements OrderConditionsUpsertTarget
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public targetStoreCsvFiles: {
      file: File
      lineLength: number
    }[] = [],
    public orderConditionStartDate: Date | string = new Date(),
    public orderConditionEndDate: Date | string = new Date(),
    public orderConditionPriority: number = 1,
    public orderingMethod: OrderingMethodTypes = OrderingMethodTypes.PredictionDemand,
    public leadTimeOnMonday: number | null = 1,
    public leadTimeOnTuesday: number | null = 1,
    public leadTimeOnWednesday: number | null = 1,
    public leadTimeOnThursday: number | null = 1,
    public leadTimeOnFriday: number | null = 1,
    public leadTimeOnSaturday: number | null = 1,
    public leadTimeOnSunday: number | null = 1,
    public orderLot: number | null = 1,
    public roundUpDownDefinition: RoundUpDownTypes = RoundUpDownTypes.Up,
    public minimumOrderQty: number | null = 1,
    public cutDate: Date | string | null = new Date('9999-12-31'),
    public deliveryType: DeliveryDateTypes = DeliveryDateTypes.AllDays,
    public displayStockQty: number | null = null,
    public displayLimitQty: number | null = null
  ) {}
}

interface OrderConditionsUpsertRequest {
  skuUnitType: OrderConditionsUpsertUnitTypes
  storeUnitType: OrderConditionsUpsertStoreUnitTypes
  targetSkus: any[]
  targetSkuCsvFiles: {
    file: File
    lineLength: number
  }[]
  targets: OrderConditionsUpsertTarget[]
}

export class OrderConditionsUpsertRequestFactory
  implements OrderConditionsUpsertRequest
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public skuUnitType: OrderConditionsUpsertUnitTypes = OrderConditionsUpsertUnitTypes.Single,
    public storeUnitType: OrderConditionsUpsertStoreUnitTypes = OrderConditionsUpsertStoreUnitTypes.All,
    public targetSkus: any[] = [],
    public targetSkuCsvFiles: {
      file: File
      lineLength: number
    }[] = [],
    public targets: OrderConditionsUpsertTarget[] = [
      new OrderConditionsUpsertTargetFactory(),
    ]
  ) {}
}

export function apiOrderConditionsUpsert(
  request: OrderConditionsUpsertRequest
): Promise<{
  skuUploadUrl: string | null
  storeUploadUrls: string[]
  importId: number
} | null> {
  // 大きな情報は削除して送信
  // 特にファイルに関してはレスポンスでアップロード用のＵＲＬを取得し、それを使用してアップロードする
  return apiPost('/order-conditions/upsert', {
    skuUnitType: request.skuUnitType,
    storeUnitType: request.storeUnitType,
    targetSkuIds: request.targetSkus.map((v) => v.skuId),
    targets: request.targets.map((v) => {
      return {
        orderConditionStartDate: v.orderConditionStartDate,
        orderConditionEndDate: v.orderConditionEndDate,
        orderConditionPriority: v.orderConditionPriority,
        orderingMethod: v.orderingMethod,
        leadTimeOnMonday: v.leadTimeOnMonday,
        leadTimeOnTuesday: v.leadTimeOnTuesday,
        leadTimeOnWednesday: v.leadTimeOnWednesday,
        leadTimeOnThursday: v.leadTimeOnThursday,
        leadTimeOnFriday: v.leadTimeOnFriday,
        leadTimeOnSaturday: v.leadTimeOnSaturday,
        leadTimeOnSunday: v.leadTimeOnSunday,
        orderLot: v.orderLot,
        roundUpDownDefinition: v.roundUpDownDefinition,
        minimumOrderQty: v.minimumOrderQty,
        cutDate: v.cutDate,
        deliveryType: v.deliveryType,
        displayStockQty: v.displayStockQty,
        displayLimitQty: v.displayLimitQty,
      }
    }),
  })
}
