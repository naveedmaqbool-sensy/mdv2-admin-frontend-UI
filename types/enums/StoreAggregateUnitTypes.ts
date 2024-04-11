// 店舗集計単位
enum StoreAggregateUnitTypes {
  Store = 1, // 店舗別
  Area, // 店グループ別
}

namespace StoreAggregateUnitTypes {
  export function getName(type: StoreAggregateUnitTypes) {
    switch (type) {
      case StoreAggregateUnitTypes.Store:
        return '店舗別'
      case StoreAggregateUnitTypes.Area:
        return '店グループ別'
    }
  }

  export function getNameValues() {
    return [StoreAggregateUnitTypes.Store, StoreAggregateUnitTypes.Area].map(
      (v) => {
        return {
          name: getName(v),
          value: v,
        }
      }
    )
  }
}

export default StoreAggregateUnitTypes
