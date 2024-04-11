// 商品集計単位
enum SkuAggregateUnitTypes {
  Sku, // SKU
  Group, // 部門
  Department, // 中分類
}

namespace SkuAggregateUnitTypes {
  export function getName(type: SkuAggregateUnitTypes) {
    switch (type) {
      case SkuAggregateUnitTypes.Sku:
        return 'SKU'
      case SkuAggregateUnitTypes.Group:
        return '部門'
      case SkuAggregateUnitTypes.Department:
        return '中分類'
    }
  }

  export function getNameValues() {
    return [
      SkuAggregateUnitTypes.Sku,
      SkuAggregateUnitTypes.Group,
      SkuAggregateUnitTypes.Department,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default SkuAggregateUnitTypes
