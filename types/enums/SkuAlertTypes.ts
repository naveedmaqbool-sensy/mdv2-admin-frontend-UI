enum SkuAlertTypes {
  MinusStock = 1,
  Adjustment = 2,
  Stock = 3,
}

namespace SkuAlertTypes {
  export function getName(type: SkuAlertTypes) {
    switch (type) {
      case SkuAlertTypes.MinusStock:
        return 'マイナス在庫'
      case SkuAlertTypes.Adjustment:
        return '加減異常'
      case SkuAlertTypes.Stock:
        return '在庫異常'
    }
  }
}

export default SkuAlertTypes
