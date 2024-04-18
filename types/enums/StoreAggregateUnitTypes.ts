// 店舗集計単位
enum StoreAggregateUnitTypes {
  All = 1,
  Store = 2, // 店舗別
  Area, // 店グループ別
}

namespace StoreAggregateUnitTypes {
  export function getName(type: StoreAggregateUnitTypes) {
    switch (type) {
      case StoreAggregateUnitTypes.All:
        return '全店計'
      case StoreAggregateUnitTypes.Store:
        return '店舗別'
      case StoreAggregateUnitTypes.Area:
        return '店グループ別'
    }
  }

  export function getNameValues() {
    return [
      StoreAggregateUnitTypes.All,
      StoreAggregateUnitTypes.Store,
      StoreAggregateUnitTypes.Area,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default StoreAggregateUnitTypes
