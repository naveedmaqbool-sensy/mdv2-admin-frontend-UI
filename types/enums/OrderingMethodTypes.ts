enum OrderingMethodTypes {
  PredictionDemand = 1, // 需要予測
  SellOneBuyOne = 2, // セルワンバイワン
  OrderingPoint = 3, // 発注点

  // グラフ表示用なので all には含めない
  // また、バリデーションの関連でサーバ側には含められないので注意
  Multiple = -1, // 複数混在
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
      case OrderingMethodTypes.Multiple:
        return '複数混在'
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
      case OrderingMethodTypes.Multiple:
        return 'gray'
    }
  }
}

export default OrderingMethodTypes
