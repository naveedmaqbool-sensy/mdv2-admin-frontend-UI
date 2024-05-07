// 横軸集計
enum MonitoringHorizontalAxisTypes {
  Daily = 1, // 日次
  Weekly, // 週次
  Monthly, // 月次
}

namespace MonitoringHorizontalAxisTypes {
  export function getName(type: MonitoringHorizontalAxisTypes) {
    switch (type) {
      case MonitoringHorizontalAxisTypes.Daily:
        return '日次'
      case MonitoringHorizontalAxisTypes.Weekly:
        return '週次'
      case MonitoringHorizontalAxisTypes.Monthly:
        return '月次'
    }
  }

  export function getNameValues() {
    return [
      MonitoringHorizontalAxisTypes.Daily,
      MonitoringHorizontalAxisTypes.Weekly,
      MonitoringHorizontalAxisTypes.Monthly,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default MonitoringHorizontalAxisTypes
