// 店舗集計単位
enum StoreMonitoringUnitTypes {
  All = 1,
  Store = 2, // 店舗別
  Area, // 店グループ別
}

namespace StoreMonitoringUnitTypes {
  export function getName(type: StoreMonitoringUnitTypes) {
    switch (type) {
      case StoreMonitoringUnitTypes.All:
        return '全店計'
      case StoreMonitoringUnitTypes.Store:
        return '店舗別'
      case StoreMonitoringUnitTypes.Area:
        return '店グループ別'
    }
  }

  export function getNameValues() {
    return [
      StoreMonitoringUnitTypes.All,
      StoreMonitoringUnitTypes.Store,
      StoreMonitoringUnitTypes.Area,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default StoreMonitoringUnitTypes
