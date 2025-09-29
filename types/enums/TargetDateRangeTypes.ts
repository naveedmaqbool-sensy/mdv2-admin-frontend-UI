// 横軸集計
enum TargetDateRangeTypes {
  Daily = 1, // 日次
  Weekly, // 週次
  Monthly, // 月次
}

namespace TargetDateRangeTypes {
  export function getName(type: TargetDateRangeTypes) {
    switch (type) {
      case TargetDateRangeTypes.Daily:
        return '日次'
      case TargetDateRangeTypes.Weekly:
        return '週次'
      case TargetDateRangeTypes.Monthly:
        return '月次'
    }
  }

  export function getNameValues() {
    return [
      TargetDateRangeTypes.Daily,
      TargetDateRangeTypes.Weekly,
      TargetDateRangeTypes.Monthly,
    ].map((v) => {
      return {
        name: `${v}:` + getName(v),
        value: v,
      }
    })
  }
}

export default TargetDateRangeTypes
