enum OrderConditionsStatusTypes {
  Uploaded = 1,
  Processing,
  Failed,
  Success,
}

namespace OrderConditionsStatusTypes {
  export function getName(e: OrderConditionsStatusTypes) {
    switch (e) {
      case OrderConditionsStatusTypes.Uploaded:
        return 'アップロード済'
      case OrderConditionsStatusTypes.Processing:
        return '処理中'
      case OrderConditionsStatusTypes.Failed:
        return '失敗'
      case OrderConditionsStatusTypes.Success:
        return '成功'
    }
  }
}

export default OrderConditionsStatusTypes
