enum SkuAlertTypes {
  TheoreticalInventoryMismatch = 101, // 理論在庫不一致
  FictitiousInventory = 102, // 架空在庫
  MinusStock1 = 201, // マイナス在庫（SENSY計算理論在庫 < 0
  MinusStock2 = 202, // マイナス在庫（クライアント理論在庫 < 0
  OverStock = 301, // 在庫過多

  // 以下発注時に作成するエラー
  OrderCaseMinusStock = 901, // 発注時マイナス在庫
}

namespace SkuAlertTypes {
  export function getName(type: SkuAlertTypes) {
    switch (type) {
      case SkuAlertTypes.TheoreticalInventoryMismatch:
        return '理論在庫不一致'
      case SkuAlertTypes.FictitiousInventory:
        return '架空在庫'
      case SkuAlertTypes.MinusStock1:
      case SkuAlertTypes.MinusStock2:
        return 'マイナス在庫'
      case SkuAlertTypes.OverStock:
        return '在庫過多'

      // 以下発注時に作成するエラー
      case SkuAlertTypes.OrderCaseMinusStock:
        return '発注時マイナス在庫'
    }
  }
}

export default SkuAlertTypes
