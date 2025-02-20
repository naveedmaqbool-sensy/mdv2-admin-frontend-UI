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

export default DeliveryDateTypes
