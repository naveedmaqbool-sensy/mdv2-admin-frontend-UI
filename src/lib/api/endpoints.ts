import { apiGet, apiPost, apiPut, apiDelete, apiDownload, apiUpload } from './client'

// ============================================================
// Alert APIs
// ============================================================

export interface AlertCountResponse {
  skuAlertCount: number
  adminAlertCount: number
}

export interface SkuAlert {
  id: string
  date: string
  storeId: string
  skuId: string
  skuAlertType: string
  storeSkuMaster?: {
    storeMaster?: { storeName: string }
    skuName?: string
  }
}

export interface AdminAlert {
  id: string
  objectiveDate: string
  monitoringType: number
  threshold: number
  skuMonitoringUnitType: number
  storeMonitoringUnitType: number
  adminAlertTargets?: AdminAlertTarget[]
}

export interface AdminAlertTarget {
  id: string
  skuId?: string
  groupId?: string
  departmentId?: string
  lineId?: string
  classId?: string
  storeId?: string
  targetName?: string
}

export async function fetchAlertCounts(params: { from?: Date | null; to?: Date | null }) {
  return apiGet<AlertCountResponse>('/alert/summary', {
    from: params.from,
    to: params.to,
  })
}

export async function fetchStockAlerts(params: {
  page: number
  perPage: number
  from?: Date | null
  to?: Date | null
}) {
  return apiGet<{ data: SkuAlert[]; total: number }>('/stock-alerts', params)
}

export async function fetchThresholdAlerts(params: {
  page: number
  perPage: number
  from?: Date | null
  to?: Date | null
}) {
  return apiGet<{ data: AdminAlert[]; total: number }>('/threshold-alerts', params)
}

export async function fetchThresholdAlertTargets(params: {
  id: string
  page: number
  perPage: number
  isStore?: boolean
}) {
  return apiGet<{ data: AdminAlertTarget[]; total: number }>('/threshold-alert/targets', params)
}

// ============================================================
// User APIs
// ============================================================

export interface User {
  id: string
  employeeId: string
  name: string
  email: string
  permission: number
  isActive: boolean
  stores?: { storeId: string; storeName: string }[]
  departments?: { departmentId: string; departmentName: string }[]
}

export async function fetchUsers(params?: { page?: number; perPage?: number; search?: string }) {
  return apiGet<{ data: User[]; total: number }>('/users', params)
}

export async function fetchUser(id: string) {
  return apiGet<User>(`/users/${id}`)
}

export async function createUser(data: Partial<User> & { password?: string }) {
  return apiPost<User>('/users', data)
}

export async function updateUser(id: string, data: Partial<User> & { password?: string }) {
  return apiPut<User>(`/users/${id}`, data)
}

export async function deleteUser(id: string) {
  return apiDelete<void>(`/users/${id}`)
}

// ============================================================
// Config / Threshold APIs
// ============================================================

export interface ThresholdConfig {
  id: string
  name: string
  monitoringType: number
  threshold: number
  skuMonitoringUnitType: number | null
  skuMonitoringRangeType: number | null
  storeMonitoringUnitType: number | null
  storeMonitoringRangeType: number | null
  isActive: boolean
}

export async function fetchThresholdConfigs() {
  return apiGet<ThresholdConfig[]>('/admin-alert-thresholds')
}

export async function fetchThresholdConfig(id: string) {
  return apiGet<ThresholdConfig>(`/admin-alert-threshold/${id}`)
}

export async function createThresholdConfig(data: Partial<ThresholdConfig>) {
  return apiPost<ThresholdConfig>('/admin-alert-threshold', data)
}

export async function updateThresholdConfig(id: string, data: Partial<ThresholdConfig>) {
  return apiPut<ThresholdConfig>(`/admin-alert-threshold/${id}`, data)
}

export async function deleteThresholdConfig(id: string) {
  return apiDelete<void>(`/admin-alert-threshold/${id}`)
}

// ============================================================
// Order APIs
// ============================================================

export interface OrderRecord {
  id: string
  date: string
  storeId: string
  storeName: string
  skuId: string
  skuName: string
  orderQty: number
  correctedOrderQty: number | null
  arrivalDate: string | null
  evidenceId: string | null
}

export async function fetchOrders(params: {
  page: number
  perPage: number
  from?: Date | null
  to?: Date | null
  storeId?: string | null
}) {
  return apiPost<{ data: OrderRecord[]; total: number }>('/orders', params)
}

export async function downloadEvidence(params: { evidenceId: string }) {
  return apiDownload('/order/evidence', params)
}

// ============================================================
// Order Conditions APIs
// ============================================================

export interface OrderCondition {
  id: string
  skuId: string
  skuName: string
  storeId: string
  storeName: string
  orderConditionStartDate: string
  orderConditionEndDate: string
  orderConditionPriority: number
  orderingMethod: number
  leadTimeOnMonday: number | null
  leadTimeOnTuesday: number | null
  leadTimeOnWednesday: number | null
  leadTimeOnThursday: number | null
  leadTimeOnFriday: number | null
  leadTimeOnSaturday: number | null
  leadTimeOnSunday: number | null
  orderLot: number | null
  roundUpDownDefinition: number
  minimumOrderQty: number | null
  displayStockQty: number | null
  displayLimitQty: number | null
  cutDate: string | null
  deliveryType: number
  deliveryPriority: string
  leadTimeDays: number
  safetyStockDays: number | null
  endOfSaleDate: string | null
  storeMaster?: { storeName: string }
  storeSkuMaster?: {
    janCode: string
    skuName: string
    groupMaster?: { groupName: string }
    departmentMaster?: { departmentName: string }
    lineMaster?: { lineName: string }
    classMaster?: { className: string }
  }
}

export async function fetchOrderConditions(params?: {
  page?: number
  perPage?: number
  search?: string
  skuId?: string
  storeId?: string
}) {
  return apiPost<{ data: OrderCondition[]; total: number }>('/order-conditions/fetch', params)
}

export async function fetchOrderCondition(id: string) {
  return apiGet<OrderCondition>(`/order-conditions/find`, { id })
}

export async function updateOrderCondition(skuId: string, data: Partial<OrderCondition>) {
  return apiPost<OrderCondition>(`/order-conditions/update`, { skuId, ...data })
}

export interface OrderConditionHistory {
  id: string
  createdAt: string
  createdBy: string
  updateType: string
  targetSkuCount: number
  targetStoreCount: number
  hasError: boolean
  status: string
}

export async function fetchOrderConditionHistories(params?: {
  page?: number
  perPage?: number
  from?: Date | null
  to?: Date | null
}) {
  return apiPost<{ data: OrderConditionHistory[]; total: number }>('/order-conditions/history/fetch', params)
}

export async function uploadOrderConditionsCsv(file: File) {
  return apiUpload<{ message: string; errorCount: number }>('/order-conditions/csv-import', file, 'csv_file')
}

export async function upsertOrderConditions(data: any) {
  return apiPost<{ message: string }>('/order-conditions/upsert', data)
}

// ============================================================
// Monitoring APIs
// ============================================================

export interface MonitoringResponse {
  headers: string[]
  rows: Record<string, string>[]
  total: number
}

export async function fetchMonitoring(params: any) {
  return apiPost<MonitoringResponse>('/monitoring', params)
}

export async function exportMonitoringCsv(params: any) {
  return apiDownload('/monitoring/csv-export', params)
}

export interface MonitoringDetail {
  date: string
  storeId: string
  storeName: string
  departmentName: string
  skuId: string
  skuName: string
  recommendedOrderQty: number
  actualOrderQty: number
  differenceOrderQty: number
}

export async function fetchMonitoringDetail(params: any) {
  return apiPost<{ data: MonitoringDetail[]; total: number }>('/monitoring/detail', params)
}

export async function exportMonitoringDetailCsv(params: any) {
  return apiDownload('/monitoring/detail/csv-export', params)
}

// ============================================================
// Effectiveness APIs
// ============================================================

export interface EffectivenessResponse {
  records: {
    objectiveDate: string
    salesQty: number
    stockQty: number
    arrivalQty: number
    displayStockQty: number
    orderQty: number
    orderingMethod: number | null
  }[]
  orderingMethodRecords: {
    orderingMethod: number | null
    averageStockQty: number
    noStockCount: number
    inventoryTurnoverRate: number
    inventoryTurnoverDays: number
  }[]
  errorMessage: string | null
}

export async function fetchEffectiveness(params: {
  from: Date
  to: Date
  unitType: number
  targetId: string
  storeId: string
  targetDateRangeType?: number
}) {
  return apiPost<EffectivenessResponse>('/effectiveness', params)
}

// ============================================================
// Master Data APIs (for modals)
// ============================================================

export interface SkuMaster {
  skuId: string
  skuName: string
  groupName: string
  departmentName: string
  lineName: string
  className: string
}

export interface StoreMaster {
  storeId: string
  storeName: string
}

export interface GroupMaster {
  groupId: string
  groupName: string
}

export interface DepartmentMaster {
  departmentId: string
  departmentName: string
  groupName: string
}

export interface LineMaster {
  lineId: string
  lineName: string
  groupName: string
  departmentName: string
}

export interface ClassMaster {
  classId: string
  className: string
  groupName: string
  departmentName: string
  lineName: string
}

export interface StoreGroup {
  storeGroupId: string
  storeGroupName: string
}

export async function fetchSkuMasters(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: SkuMaster[]; total: number }>('/skus', params)
}

export async function fetchStoreMasters(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: StoreMaster[]; total: number }>('/stores', params)
}

export async function fetchGroupMasters(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: GroupMaster[]; total: number }>('/groups', params)
}

export async function fetchDepartmentMasters(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: DepartmentMaster[]; total: number }>('/departments', params)
}

export async function fetchLineMasters(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: LineMaster[]; total: number }>('/lines', params)
}

export async function fetchClassMasters(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: ClassMaster[]; total: number }>('/classes', params)
}

export async function fetchStoreGroups(params: { text?: string; page: number; perPage: number }) {
  return apiGet<{ data: StoreGroup[]; total: number }>('/store-groups', params)
}
