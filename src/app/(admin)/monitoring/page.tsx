'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronRight,
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import SelectObjectModal from '@/components/monitoring/SelectObjectModal'
import DetailModal from '@/components/monitoring/DetailModal'
import {
  MonitoringType,
  getMonitoringTypeOptions,
  SkuMonitoringUnitType,
  getSkuMonitoringUnitTypeOptions,
  getSkuMonitoringUnitTypeName,
  StoreMonitoringUnitType,
  getStoreMonitoringUnitTypeOptions,
  MonitoringHorizontalAxisType,
  getMonitoringHorizontalAxisTypeOptions,
  formatNumber
} from '@/types/enums'
import { 
  fetchMonitoring, 
  exportMonitoringCsv,
  fetchMonitoringDetail,
  exportMonitoringDetailCsv,
  MonitoringDetail 
} from '@/lib/api/endpoints'
import { 
  fetchSkuMasters, 
  fetchGroupMasters, 
} from '@/lib/api/endpoints'

export default function MonitoringPage() {
  // Form State
  const [monitoringType, setMonitoringType] = useState<MonitoringType>(MonitoringType.OrderQty)
  const [skuUnitType, setSkuUnitType] = useState<SkuMonitoringUnitType>(SkuMonitoringUnitType.Sku)
  const [skuRangeType, setSkuRangeType] = useState<SkuMonitoringUnitType | null>(null)
  const [storeUnitType, setStoreUnitType] = useState<StoreMonitoringUnitType>(StoreMonitoringUnitType.Store)
  const [axisType, setAxisType] = useState<MonitoringHorizontalAxisType>(MonitoringHorizontalAxisType.Day)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Selected Items State
  const [selectedSkus, setSelectedSkus] = useState<Record<string, unknown>[]>([])
  const [selectedGroups, setSelectedGroups] = useState<Record<string, unknown>[]>([])
  const [selectedDepartments] = useState<Record<string, unknown>[]>([])
  const [selectedLines] = useState<Record<string, unknown>[]>([])
  const [selectedClasses] = useState<Record<string, unknown>[]>([])
  const [selectedStores] = useState<Record<string, unknown>[]>([])

  // Modal State
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Results State
  const [kpiHeaders, setKpiHeaders] = useState<string[]>([])
  const [kpiRows, setKpiRows] = useState<Record<string, unknown>[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // Detail State
  const [detailItems, setDetailItems] = useState<MonitoringDetail[]>([])
  const [detailTotal, setDetailTotal] = useState(0)
  const [detailPage, setDetailPage] = useState(1)
  const [detailSearchText, setDetailSearchText] = useState('')
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null)

  const perPage = 10

  // Derive SKU Range Options based on Unit Type
  const skuRangeOptions = useMemo(() => {
    const options = [
      SkuMonitoringUnitType.Group,
      SkuMonitoringUnitType.Department,
      SkuMonitoringUnitType.Line,
      SkuMonitoringUnitType.Class,
      SkuMonitoringUnitType.Sku
    ]
    return options.map(v => ({ label: getSkuMonitoringUnitTypeName(v), value: v }))
  }, [])

  // Handle Fetch Monitoring
  async function handleFetch(page: number) {
    setLoading(true)
    setCurrentPage(page)
    const params = {
      monitoringType,
      skuMonitoringUnitType: skuUnitType,
      skuMonitoringRangeType: skuRangeType,
      storeMonitoringUnitType: storeUnitType,
      monitoringHorizontalAxisType: axisType,
      targetDateFrom: dateFrom,
      targetDateTo: dateTo,
      skus: selectedSkus,
      groups: selectedGroups,
      departments: selectedDepartments,
      lines: selectedLines,
      classes: selectedClasses,
      stores: selectedStores,
      page,
      perPage
    }
    const result = await fetchMonitoring(params)
    setLoading(false)
    if (result) {
      setKpiHeaders(result.headers)
      setKpiRows(result.rows)
      setTotalItems(result.total)
    }
  }

  // Handle Detail Fetch
  async function handleFetchDetail(text: string, page: number) {
    if (!selectedTargetId) return
    setDetailPage(page)
    const params = {
      monitoringType,
      targetId: selectedTargetId,
      searchText: text,
      page,
      perPage
    }
    const result = await fetchMonitoringDetail(params)
    if (result) {
      setDetailItems(result.data)
      setDetailTotal(result.total)
    }
  }

  function onRowClick(row: Record<string, unknown>) {
    if ([MonitoringType.OrderChangeQty, MonitoringType.OrderChangeRate].includes(monitoringType)) {
      setSelectedTargetId(row['0'] as string)
      setIsDetailModalOpen(true)
      handleFetchDetail('', 1)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="モニタリング"
        subtitle="システム全体の稼働状況を多角的に分析・監視します"
      />

      {/* Modern Filter Card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200/60">
        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Indicator */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-gray-700 uppercase tracking-wider">指標</label>
              <select
                value={monitoringType}
                onChange={(e) => setMonitoringType(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              >
                {getMonitoringTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Product Unit */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-gray-700 uppercase tracking-wider">商品 取得単位</label>
              <select
                value={skuUnitType}
                onChange={(e) => setSkuUnitType(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              >
                {getSkuMonitoringUnitTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Product Range */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-gray-700 uppercase tracking-wider">商品 取得範囲</label>
              <div className="flex items-center gap-2">
                <select
                  value={skuRangeType ?? ''}
                  onChange={(e) => setSkuRangeType(e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">-</option>
                  {skuRangeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsSkuModalOpen(true)}
                  disabled={!skuRangeType}
                  className="rounded-xl bg-gray-900 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-40"
                >
                  選択
                </button>
              </div>
              {(selectedSkus.length > 0 || selectedGroups.length > 0) && (
                <p className="text-sm text-indigo-600 font-medium">
                  {selectedSkus.length || selectedGroups.length}件選択中
                </p>
              )}
            </div>

            {/* Store Unit */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-gray-700 uppercase tracking-wider">店舗 取得単位</label>
              <select
                value={storeUnitType}
                onChange={(e) => setStoreUnitType(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              >
                {getStoreMonitoringUnitTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Axis Type */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-gray-700 uppercase tracking-wider">期間 集計単位</label>
              <select
                value={axisType}
                onChange={(e) => setAxisType(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              >
                {getMonitoringHorizontalAxisTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-gray-700 uppercase tracking-wider">対象期間</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="text-lg text-gray-300 font-light">～</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMonitoringType(MonitoringType.OrderQty)
                setSkuUnitType(SkuMonitoringUnitType.Sku)
                setSkuRangeType(null)
                setSelectedSkus([])
                setSelectedGroups([])
                setStoreUnitType(StoreMonitoringUnitType.Store)
                setAxisType(MonitoringHorizontalAxisType.Day)
                setDateFrom('')
                setDateTo('')
              }}
              className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-base font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              リセット
            </button>
            <button
              onClick={() => handleFetch(1)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 text-base font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
              画面表示
            </button>
          </div>
          <button
            onClick={() => exportMonitoringCsv(null)}
            disabled={kpiRows.length === 0}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-base font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-40"
          >
            CSV出力
          </button>
        </div>
      </div>

      {/* Results Section */}
      {kpiRows.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200/60">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {kpiHeaders.map((header, i) => (
                    <th
                      key={i}
                      className={`whitespace-nowrap px-6 py-5 text-[15px] font-bold uppercase tracking-wider text-gray-500 ${i === 0 ? 'sticky left-0 z-20 bg-gray-50/70 backdrop-blur-md' : ''}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {kpiRows.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => onRowClick(row)}
                    className="group cursor-pointer transition-colors hover:bg-indigo-50/30"
                  >
                    {kpiHeaders.map((_, j) => {
                      const val = row[j.toString()]
                      return (
                        <td
                          key={j}
                          className="whitespace-nowrap px-6 py-4 text-base text-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            {j === 0 && ( MonitoringType.OrderChangeQty === monitoringType || MonitoringType.OrderChangeRate === monitoringType) && (
                              <ChevronRight className="h-3.5 w-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                            {val as React.ReactNode}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 p-6">
            <span className="text-base font-medium text-gray-500">
              全 <span className="text-gray-900">{formatNumber(totalItems)}</span> 件
            </span>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              perPage={perPage}
              onPageChange={handleFetch}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <SelectObjectModal
        isOpen={isSkuModalOpen}
        onClose={() => setIsSkuModalOpen(false)}
        onSave={(items) => {
          if (skuRangeType === SkuMonitoringUnitType.Sku) setSelectedSkus(items)
          else if (skuRangeType === SkuMonitoringUnitType.Group) setSelectedGroups(items)
          setIsSkuModalOpen(false)
        }}
        title={`${getSkuMonitoringUnitTypeName(skuRangeType || SkuMonitoringUnitType.Sku)}を選択`}
        idKey={skuRangeType === SkuMonitoringUnitType.Sku ? 'skuId' : skuRangeType === SkuMonitoringUnitType.Group ? 'groupId' : 'id'}
        initialSelected={
          skuRangeType === SkuMonitoringUnitType.Sku ? selectedSkus : 
          skuRangeType === SkuMonitoringUnitType.Group ? selectedGroups : []
        }
        columns={[
          { key: skuRangeType === SkuMonitoringUnitType.Sku ? 'skuId' : 'id', label: 'ID' },
          { key: skuRangeType === SkuMonitoringUnitType.Sku ? 'skuName' : 'name', label: '名称' },
        ]}
        fetchItems={async (p) => {
          if (skuRangeType === SkuMonitoringUnitType.Sku) return fetchSkuMasters(p)
          if (skuRangeType === SkuMonitoringUnitType.Group) return fetchGroupMasters(p)
          return null
        }}
      />

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={monitoringType === MonitoringType.OrderChangeQty ? '発注修正数明細' : '発注修正率明細'}
        items={detailItems}
        total={detailTotal}
        page={detailPage}
        perPage={perPage}
        searchText={detailSearchText}
        setSearchText={setDetailSearchText}
        onSearch={handleFetchDetail}
        onExportCsv={() => exportMonitoringDetailCsv({ targetId: selectedTargetId, searchText: detailSearchText })}
      />
    </div>
  )
}
