// 商品集計単位
enum SkuAggregateUnitTypes {
  Sku, // SKU
  Group, // 部門
  Department, // 中分類
  Line, // 小分類
  Class, // 種別
}

namespace SkuAggregateUnitTypes {
  export function getName(type: SkuAggregateUnitTypes) {
    switch (type) {
      case SkuAggregateUnitTypes.Sku:
        return 'ＳＫＵ'
      case SkuAggregateUnitTypes.Group:
        return '部門'
      case SkuAggregateUnitTypes.Department:
        return '中分類'
      case SkuAggregateUnitTypes.Line:
        return '小分類'
      case SkuAggregateUnitTypes.Class:
        return '種別'
    }
  }

  export function getNameValues() {
    return [
      SkuAggregateUnitTypes.Sku,
      SkuAggregateUnitTypes.Group,
      SkuAggregateUnitTypes.Department,
      SkuAggregateUnitTypes.Line,
      SkuAggregateUnitTypes.Class,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default SkuAggregateUnitTypes
