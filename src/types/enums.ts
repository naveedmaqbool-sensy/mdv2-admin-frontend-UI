// ============================================================
// SKU Alert Types
// ============================================================

export enum SkuAlertType {
  TheoreticalInventoryMismatch = '101',
  FictitiousInventory = '102',
  MinusStock = '201',
  MinusStockClient = '202',
  ZeroStockFromMonth = '203',
  ZeroStockFromWeek = '204',
}

export function getSkuAlertTypeName(type: SkuAlertType | string): string {
  switch (type) {
    case SkuAlertType.TheoreticalInventoryMismatch: return '理論在庫不一致'
    case SkuAlertType.FictitiousInventory: return '架空在庫'
    case SkuAlertType.MinusStock:
    case SkuAlertType.MinusStockClient: return 'マイナス在庫'
    case SkuAlertType.ZeroStockFromMonth: return 'ゼロ在庫(長期)'
    case SkuAlertType.ZeroStockFromWeek: return 'ゼロ在庫'
    default: return type
  }
}

// ============================================================
// Monitoring Types
// ============================================================

export enum MonitoringType {
  OrderQty = 1,
  OrderChangeQty = 2,
  OrderChangeRate = 3,
  DefectRate = 4,
  StockAlertCount = 5,
  StockAlertRate = 6,
  StockAmount = 7,
  PredictionDemand = 8,
  DefectCount = 9,
  StockRoundRate = 10,
  StockRoundDays = 11,
}

export function getMonitoringTypeName(type: MonitoringType): string {
  switch (type) {
    case MonitoringType.OrderQty: return '発注数'
    case MonitoringType.OrderChangeQty: return '発注修正数'
    case MonitoringType.OrderChangeRate: return '発注修正率'
    case MonitoringType.DefectRate: return '欠品率'
    case MonitoringType.StockAlertCount: return '在庫異常件数'
    case MonitoringType.StockAlertRate: return '在庫異常率'
    case MonitoringType.StockAmount: return '在庫数'
    case MonitoringType.PredictionDemand: return '需要予測数'
    case MonitoringType.DefectCount: return '欠品回数'
    case MonitoringType.StockRoundRate: return '在庫回転率'
    case MonitoringType.StockRoundDays: return '在庫回転日数'
    default: return ''
  }
}

export function getMonitoringTypeOptions() {
  return [
    MonitoringType.OrderQty, MonitoringType.OrderChangeQty, MonitoringType.OrderChangeRate,
    MonitoringType.DefectCount, MonitoringType.DefectRate,
    MonitoringType.StockAlertCount, MonitoringType.StockAlertRate,
    MonitoringType.PredictionDemand, MonitoringType.StockRoundDays,
    MonitoringType.StockRoundRate, MonitoringType.StockAmount,
  ].map(v => ({ label: getMonitoringTypeName(v), value: v }))
}

// ============================================================
// SKU Monitoring Unit Types
// ============================================================

export enum SkuMonitoringUnitType {
  Sku = 1,
  Group = 2,
  Department = 3,
  Line = 4,
  Class = 5,
}

export function getSkuMonitoringUnitTypeName(type: SkuMonitoringUnitType): string {
  switch (type) {
    case SkuMonitoringUnitType.Sku: return 'ＳＫＵ'
    case SkuMonitoringUnitType.Group: return '部門'
    case SkuMonitoringUnitType.Department: return '中分類'
    case SkuMonitoringUnitType.Line: return '小分類'
    case SkuMonitoringUnitType.Class: return '細分類'
    default: return ''
  }
}

export function getSkuMonitoringUnitTypeOptions() {
  return [
    SkuMonitoringUnitType.Sku, SkuMonitoringUnitType.Group,
    SkuMonitoringUnitType.Department, SkuMonitoringUnitType.Line,
    SkuMonitoringUnitType.Class,
  ].map(v => ({ label: getSkuMonitoringUnitTypeName(v), value: v }))
}

// ============================================================
// Store Monitoring Unit Types
// ============================================================

export enum StoreMonitoringUnitType {
  All = 1,
  Store = 2,
  Area = 3,
}

export function getStoreMonitoringUnitTypeName(type: StoreMonitoringUnitType): string {
  switch (type) {
    case StoreMonitoringUnitType.All: return '全店計'
    case StoreMonitoringUnitType.Store: return '店舗別'
    case StoreMonitoringUnitType.Area: return '店グループ別'
    default: return ''
  }
}

export function getStoreMonitoringUnitTypeOptions() {
  return [StoreMonitoringUnitType.All, StoreMonitoringUnitType.Store]
    .map(v => ({ label: getStoreMonitoringUnitTypeName(v), value: v }))
}

// ============================================================
// Monitoring Horizontal Axis Types
// ============================================================

export enum MonitoringHorizontalAxisType {
  Day = 1,
  Week = 2,
  Month = 3,
}

export function getMonitoringHorizontalAxisTypeName(type: MonitoringHorizontalAxisType): string {
  switch (type) {
    case MonitoringHorizontalAxisType.Day: return '日別'
    case MonitoringHorizontalAxisType.Week: return '週別'
    case MonitoringHorizontalAxisType.Month: return '月別'
    default: return ''
  }
}

export function getMonitoringHorizontalAxisTypeOptions() {
  return [
    MonitoringHorizontalAxisType.Day,
    MonitoringHorizontalAxisType.Week,
    MonitoringHorizontalAxisType.Month,
  ].map(v => ({ label: getMonitoringHorizontalAxisTypeName(v), value: v }))
}

// ============================================================
// User Permission Types
// ============================================================

export enum UserPermissionType {
  General = 1,
  Admin = 99,
}

export function getUserPermissionTypeName(type: UserPermissionType): string {
  switch (type) {
    case UserPermissionType.General: return '一般'
    case UserPermissionType.Admin: return '管理者'
    default: return ''
  }
}

export function getUserPermissionTypeOptions() {
  return [UserPermissionType.Admin, UserPermissionType.General]
    .map(v => ({ label: getUserPermissionTypeName(v), value: v }))
}

// ============================================================
// Ordering Method Types
// ============================================================

export enum OrderingMethodType {
  AiOrder = 1,
  Manual = 2,
  FixedQty = 3,
}

export function getOrderingMethodTypeName(type: OrderingMethodType | null): string {
  if (type === null) return '対象外'
  switch (type) {
    case OrderingMethodType.AiOrder: return 'AI発注'
    case OrderingMethodType.Manual: return '手動発注'
    case OrderingMethodType.FixedQty: return '定量発注'
    default: return ''
  }
}

export function getOrderingMethodTypeColor(type: OrderingMethodType | null): string {
  if (type === null) return '#999999'
  switch (type) {
    case OrderingMethodType.AiOrder: return '#6366f1'
    case OrderingMethodType.Manual: return '#f59e0b'
    case OrderingMethodType.FixedQty: return '#10b981'
    default: return '#999999'
  }
}

export function getOrderingMethodTypeOptions() {
  return [
    OrderingMethodType.AiOrder,
    OrderingMethodType.Manual,
    OrderingMethodType.FixedQty,
  ].map(v => ({ label: getOrderingMethodTypeName(v), value: v }))
}

// ============================================================
// Round Up/Down Types
// ============================================================

export enum RoundUpDownType {
  Up = 1,
  Down = 2,
}

export function getRoundUpDownTypeName(type: RoundUpDownType): string {
  switch (type) {
    case RoundUpDownType.Up: return '切上げ'
    case RoundUpDownType.Down: return '切下げ'
    default: return ''
  }
}

export function getRoundUpDownTypeOptions() {
  return [RoundUpDownType.Up, RoundUpDownType.Down]
    .map(v => ({ label: getRoundUpDownTypeName(v), value: v }))
}

// ============================================================
// Delivery Date Types
// ============================================================

export enum DeliveryDateType {
  MonSat = 1,
  AllDays = 2,
  MonFri = 5,
  MonSatEx = 6,
}

export function getDeliveryDateTypeName(type: DeliveryDateType): string {
  switch (type) {
    case DeliveryDateType.MonSat: return '平日のみ納品可'
    case DeliveryDateType.AllDays: return '全日'
    case DeliveryDateType.MonFri: return '土日祝祭日以外納品可'
    case DeliveryDateType.MonSatEx: return '平日のみ納品可（納品日前日の日祝祭日考慮）'
    default: return ''
  }
}

export function getDeliveryDateTypeOptions() {
  return [
    DeliveryDateType.MonSat,
    DeliveryDateType.AllDays,
    DeliveryDateType.MonFri,
    DeliveryDateType.MonSatEx,
  ].map(v => ({ label: getDeliveryDateTypeName(v), value: v }))
}

// ============================================================
// Order Conditions Status Types
// ============================================================

export enum OrderConditionsStatusType {
  Processing = 1,
  Completed = 2,
  Error = 3,
}

export function getOrderConditionsStatusTypeName(type: OrderConditionsStatusType): string {
  switch (type) {
    case OrderConditionsStatusType.Processing: return '処理中'
    case OrderConditionsStatusType.Completed: return '処理済み'
    case OrderConditionsStatusType.Error: return 'エラー'
    default: return ''
  }
}

// ============================================================
// Target Date Range Types
// ============================================================

export enum TargetDateRangeType {
  Day = 1,
  Week = 2,
  Month = 3,
}

export function getTargetDateRangeTypeName(type: TargetDateRangeType): string {
  switch (type) {
    case TargetDateRangeType.Day: return '日'
    case TargetDateRangeType.Week: return '週'
    case TargetDateRangeType.Month: return '月'
    default: return ''
  }
}

// ============================================================
// Utility: Format number with commas
// ============================================================

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  return num.toLocaleString('ja-JP')
}

// ============================================================
// Utility: Format date
// ============================================================

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}
