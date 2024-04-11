// 集計項目
enum AggregateTypes {
  OrderPty = 1, // 発注数
  OrderChangePty, // 発注修正数
  OrderChangeRate, // 発注修正率
  DefectRate, // 欠品率
  StockAlertCount, // 在庫異常件数
  StockAlertRate, // 在庫異常率
}

namespace AggregateTypes {
  export function getName(type: AggregateTypes) {
    switch (type) {
      case AggregateTypes.OrderPty:
        return '発注数'
      case AggregateTypes.OrderChangePty:
        return '発注修正数'
      case AggregateTypes.OrderChangeRate:
        return '発注修正率'
      case AggregateTypes.DefectRate:
        return '欠品率'
      case AggregateTypes.StockAlertCount:
        return '在庫異常件数'
      case AggregateTypes.StockAlertRate:
        return '在庫異常率'
    }
  }

  export function getNameValues() {
    return [
      AggregateTypes.OrderPty,
      AggregateTypes.OrderChangePty,
      AggregateTypes.OrderChangeRate,
      AggregateTypes.DefectRate,
      AggregateTypes.StockAlertCount,
      AggregateTypes.StockAlertRate,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default AggregateTypes
