// 集計店舗
enum StoreAggregateUnitTypes {
  All = 1, // 全店計
  Single, // 店舗計
}

namespace StoreAggregateUnitTypes {
  export function getName(type: StoreAggregateUnitTypes) {
    switch (type) {
      case StoreAggregateUnitTypes.All:
        return '全店計'
      case StoreAggregateUnitTypes.Single:
        return '店舗計'
    }
  }

  export function getNameValues() {
    return [StoreAggregateUnitTypes.All, StoreAggregateUnitTypes.Single].map(
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
