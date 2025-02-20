enum OrderingMethodTypes {
  PredictionDemand = 1, // 需要予測
  SellOneBuyOne = 2, // セルワンバイワン
}
namespace OrderingMethodTypes {
  export function getName(orderingMethodType: OrderingMethodTypes) {
    switch (orderingMethodType) {
      case OrderingMethodTypes.PredictionDemand:
        return '需要予測'
      case OrderingMethodTypes.SellOneBuyOne:
        return 'セルワンバイワン'
    }
  }

  export function all() {
    return [
      OrderingMethodTypes.PredictionDemand,
      OrderingMethodTypes.SellOneBuyOne,
    ]
  }

  export function getNameValues() {
    return all().map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default OrderingMethodTypes
