import DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import RoundUpDownTypes from '~/types/enums/RoundUpTypes'
import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

interface OrderConditionsUpsertTarget
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
  targetStores: StoreMaster[]
}

export class OrderConditionsUpsertTargetFactory
  implements OrderConditionsUpsertTarget
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public targetStores: StoreMaster[] = [],
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
  targetSkus: any[]
  targets: OrderConditionsUpsertTarget[]
}

export class OrderConditionsUpsertRequestFactory
  implements OrderConditionsUpsertRequest
{
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    public targetSkus: any[] = [],
    public targets: OrderConditionsUpsertTarget[] = [
      new OrderConditionsUpsertTargetFactory(),
    ]
  ) {}
}

export function apiOrderConditionsUpsert(
  request: OrderConditionsUpsertRequest
): Promise<OrderConditionsMaster | null> {
  return apiGet('/order-conditions/upsert', request)
}
