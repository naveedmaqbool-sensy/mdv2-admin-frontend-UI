enum DeliveryDateTypes {
  /**
   * 月～土（祝日を除く）
   */
  MonSat = 1,

  /**
   * 全日（月～日＋祝日）
   */
  AllDays = 2,

  /**
   * 月～金（祝日を除く）
   */
  MonFri = 5,

  /**
   * MonSat + 納品日前日の日曜祝祭日考慮
   */
  MonSatEx = 6,
}
namespace DeliveryDateTypes {
  export function getName(type: DeliveryDateTypes) {
    switch (type) {
      case DeliveryDateTypes.MonSat:
        return '平日のみ納品可'
      case DeliveryDateTypes.AllDays:
        return '全日'
      case DeliveryDateTypes.MonFri:
        return '土日祝祭日以外納品可'
      case DeliveryDateTypes.MonSatEx:
        return '平日のみ納品可（納品日前日の日祝祭日考慮）'
    }
  }

  export function all() {
    return [
      DeliveryDateTypes.MonSat,
      DeliveryDateTypes.AllDays,
      DeliveryDateTypes.MonFri,
      DeliveryDateTypes.MonSatEx,
    ]
  }

  export function getNameValues() {
    return all().map((v) => {
      return {
        name: `${v}:` + getName(v),
        value: v,
      }
    })
  }
}

export default DeliveryDateTypes
