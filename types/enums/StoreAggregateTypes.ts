// 集計店舗
enum StoreAggregateTypes {
  All = 1, // 全店計
  Single, // 店舗計
}

namespace StoreAggregateTypes {
  export function getName(type: StoreAggregateTypes) {
    switch (type) {
      case StoreAggregateTypes.All:
        return '全店計'
      case StoreAggregateTypes.Single:
        return '店舗計'
    }
  }

  export function getNameValues() {
    return [StoreAggregateTypes.All, StoreAggregateTypes.Single].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default StoreAggregateTypes
