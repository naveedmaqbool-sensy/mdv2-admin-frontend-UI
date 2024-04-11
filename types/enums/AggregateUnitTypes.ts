// 集計単位
enum AggregateUnitTypes {
  Store = 1, // 店舗
  Sku, // 商品
}

namespace AggregateUnitTypes {
  export function getName(type: AggregateUnitTypes) {
    switch (type) {
      case AggregateUnitTypes.Store:
        return '店舗'
      case AggregateUnitTypes.Sku:
        return '商品'
    }
  }

  export function getNameValues() {
    return [AggregateUnitTypes.Store, AggregateUnitTypes.Sku].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default AggregateUnitTypes
