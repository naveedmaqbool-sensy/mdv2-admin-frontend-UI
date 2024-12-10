enum SkuAlertTypes {
  TheoreticalInventoryMismatch = '101', // 理論在庫不一致
  FictitiousInventory = '102', // 架空在庫
  MinusStock = '201', // マイナス在庫（SENSY計算理論在庫 < 0
  MinusStockClient = '202', // マイナス在庫（受領理論在庫 < 0
  ZeroStockFromMonth = '203', // ゼロ在庫（理論在庫が１か月以上ゼロのまま）
  ZeroStockFromWeek = '204', // ゼロ在庫（理論在庫が１週間以上ゼロのまま）
}

namespace SkuAlertTypes {
  export function getName(type: SkuAlertTypes | string) {
    switch (type) {
      case SkuAlertTypes.TheoreticalInventoryMismatch:
        return '理論在庫不一致'
      case SkuAlertTypes.FictitiousInventory:
        return '架空在庫'
      case SkuAlertTypes.MinusStock:
      case SkuAlertTypes.MinusStockClient:
        return 'マイナス在庫'
      case SkuAlertTypes.ZeroStockFromMonth:
        return 'ゼロ在庫(長期)'
      case SkuAlertTypes.ZeroStockFromWeek:
        return 'ゼロ在庫'
    }
  }
}

export default SkuAlertTypes
