enum OrderingMethodTypes {
  PredictionDemand = 1, // 需要予測
  SellOneBuyOne = 2, // セルワンバイワン
  OrderingPoint = 3, // 発注点
}
namespace OrderingMethodTypes {
  export function getName(orderingMethodType: OrderingMethodTypes) {
    switch (orderingMethodType) {
      case OrderingMethodTypes.PredictionDemand:
        return '需要予測'
      case OrderingMethodTypes.SellOneBuyOne:
        return 'セルワンバイワン'
      case OrderingMethodTypes.OrderingPoint:
        return '発注点'
    }
  }

  export function all() {
    return [
      OrderingMethodTypes.PredictionDemand,
      OrderingMethodTypes.SellOneBuyOne,
      OrderingMethodTypes.OrderingPoint,
    ]
  }

  export function getNameValues() {
    return all().map((v) => {
      return {
        name: `${v}:` + getName(v),
        value: v,
      }
    })
  }

  export function getGraphColor(orderingMethodType: OrderingMethodTypes) {
    switch (orderingMethodType) {
      case OrderingMethodTypes.PredictionDemand:
        return 'black'
      case OrderingMethodTypes.SellOneBuyOne:
        return 'blue'
      case OrderingMethodTypes.OrderingPoint:
        return 'green'
    }
  }
}

export default OrderingMethodTypes
