// 横軸集計
enum AggregateHorizontalAxisTypes {
  Daily = 1, // 日次
  Weekly, // 週次
  Monthly, // 月次
}

namespace AggregateHorizontalAxisTypes {
  export function getName(type: AggregateHorizontalAxisTypes) {
    switch (type) {
      case AggregateHorizontalAxisTypes.Daily:
        return '日次'
      case AggregateHorizontalAxisTypes.Weekly:
        return '週次'
      case AggregateHorizontalAxisTypes.Monthly:
        return '月次'
    }
  }

  export function getNameValues() {
    return [
      AggregateHorizontalAxisTypes.Daily,
      AggregateHorizontalAxisTypes.Weekly,
      AggregateHorizontalAxisTypes.Monthly,
    ].map((v) => {
      return {
        name: getName(v),
        value: v,
      }
    })
  }
}

export default AggregateHorizontalAxisTypes
