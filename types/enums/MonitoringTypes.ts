// 集計項目
enum MonitoringTypes {
  OrderPty = 1, // 発注数
  OrderChangePty, // 発注修正数
  OrderChangeRate, // 発注修正率
  DefectRate, // 欠品率
  StockAlertCount, // 在庫異常件数
  StockAlertRate, // 在庫異常率
  StockAmount, // 在庫数
  PredictionDemand, // 予測予測
  DefectCount, // 欠品回数
  StockRoundRate, // 在庫回転率
  StockRoundDays, // 在庫回転日数
}

namespace MonitoringTypes {
  export function getName(type: MonitoringTypes) {
    switch (type) {
      case MonitoringTypes.OrderPty:
        return '発注数'
      case MonitoringTypes.OrderChangePty:
        return '発注修正数'
      case MonitoringTypes.OrderChangeRate:
        return '発注修正率'
      case MonitoringTypes.DefectRate:
        return '欠品率'
      case MonitoringTypes.StockAlertCount:
        return '在庫異常件数'
      case MonitoringTypes.StockAlertRate:
        return '在庫異常率'
      case MonitoringTypes.StockAmount:
        return '在庫数'
      case MonitoringTypes.PredictionDemand:
        return '需要予測数'
      case MonitoringTypes.DefectCount:
        return '欠品回数'
      case MonitoringTypes.StockRoundRate:
        return '在庫回転率'
      case MonitoringTypes.StockRoundDays:
        return '在庫回転日数'
    }
  }

  export function getNameValues() {
    return [
      MonitoringTypes.OrderPty,
      MonitoringTypes.OrderChangePty,
      MonitoringTypes.OrderChangeRate,
      MonitoringTypes.DefectRate,
      MonitoringTypes.StockAlertCount,
      MonitoringTypes.StockAlertRate,
    ].map((v) => {
      return {
        name: `${v}:` + getName(v),
        value: v,
      }
    })
  }

  export function getMonitoringNameValues() {
    return [
      MonitoringTypes.OrderPty,
      MonitoringTypes.OrderChangePty,
      MonitoringTypes.OrderChangeRate,
      MonitoringTypes.DefectCount,
      MonitoringTypes.DefectRate,
      MonitoringTypes.StockAlertCount,
      MonitoringTypes.StockAlertRate,
      MonitoringTypes.PredictionDemand,
      MonitoringTypes.StockRoundDays,
      MonitoringTypes.StockRoundRate,
      MonitoringTypes.StockAmount,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default MonitoringTypes
