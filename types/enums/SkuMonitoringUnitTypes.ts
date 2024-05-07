// 商品集計単位
enum SkuMonitoringUnitTypes {
  Sku, // SKU
  Group, // 部門
  Department, // 中分類
  Line, // 小分類
  Class, // 種別
}

namespace SkuMonitoringUnitTypes {
  export function getName(type: SkuMonitoringUnitTypes) {
    switch (type) {
      case SkuMonitoringUnitTypes.Sku:
        return 'ＳＫＵ'
      case SkuMonitoringUnitTypes.Group:
        return '部門'
      case SkuMonitoringUnitTypes.Department:
        return '中分類'
      case SkuMonitoringUnitTypes.Line:
        return '小分類'
      case SkuMonitoringUnitTypes.Class:
        return '種別'
    }
  }

  export function getNameValues() {
    return [
      SkuMonitoringUnitTypes.Sku,
      SkuMonitoringUnitTypes.Group,
      SkuMonitoringUnitTypes.Department,
      SkuMonitoringUnitTypes.Line,
      SkuMonitoringUnitTypes.Class,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default SkuMonitoringUnitTypes
