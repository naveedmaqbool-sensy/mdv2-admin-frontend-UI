'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  TrendingUp, 
  Search, 
  RotateCcw, 
  Calendar,
  LayoutGrid,
  Store,
  Loader2,
  AlertCircle
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import SelectObjectModal from '@/components/monitoring/SelectObjectModal'
import Datepicker from '@/components/Datepicker'
import {
  SkuMonitoringUnitType,
  getSkuMonitoringUnitTypeOptions,
  getSkuMonitoringUnitTypeName,
  TargetDateRangeType,
  getOrderingMethodTypeName,
  getOrderingMethodTypeColor,
  formatNumber,
  formatDate
} from '@/types/enums'
import { 
  fetchEffectiveness, 
  EffectivenessResponse 
} from '@/lib/api/endpoints'
import { 
  fetchSkuMasters, 
  fetchGroupMasters, 
  fetchDepartmentMasters, 
  fetchLineMasters, 
  fetchClassMasters, 
  fetchStoreMasters 
} from '@/lib/api/endpoints'

export default function EffectivenessPage() {
  // Form State
  const [unitType, setUnitType] = useState<SkuMonitoringUnitType>(SkuMonitoringUnitType.Sku)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [rangeType] = useState<TargetDateRangeType>(TargetDateRangeType.Day)

  // Selected Items
  const [selectedSkus, setSelectedSkus] = useState<Record<string, any>[]>([])
  const [selectedGroups, setSelectedGroups] = useState<Record<string, any>[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<Record<string, any>[]>([])
  const [selectedLines, setSelectedLines] = useState<Record<string, any>[]>([])
  const [selectedClasses, setSelectedClasses] = useState<Record<string, any>[]>([])
  const [selectedStores, setSelectedStores] = useState<Record<string, any>[]>([])

  // UI State
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false)
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    targetId: string
    targetName: string
    storeId: string
    storeName: string
    data: any[]
    orderingMethodData: any[]
    errorMessage: string | null
    loading: boolean
  }[]>([])

  // Initialization: check for cached data or monitoring transition
  useEffect(() => {
    // In a real app, logic to handle transition from Monitoring would go here
    // For now, set a default date range
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(today.getMonth() - 1)
    setDateFrom(lastMonth.toISOString().split('T')[0])
    setDateTo(today.toISOString().split('T')[0])
  }, [])

  const handleFetch = useCallback(async () => {
    setLoading(true)
    
    // Create categories based on selected stores and items
    const initialResults: any[] = []
    const targets = unitType === SkuMonitoringUnitType.Sku ? selectedSkus :
                  unitType === SkuMonitoringUnitType.Group ? selectedGroups :
                  unitType === SkuMonitoringUnitType.Department ? selectedDepartments :
                  unitType === SkuMonitoringUnitType.Line ? selectedLines : selectedClasses

    selectedStores.forEach(store => {
      targets.forEach(target => {
        initialResults.push({
          targetId: target.skuId || target.groupId || target.id,
          targetName: target.skuName || target.groupName || target.name,
          storeId: store.storeId,
          storeName: store.storeName,
          data: [],
          orderingMethodData: [],
          errorMessage: null,
          loading: true
        })
      })
    })

    setResults(initialResults)

    // Fetch data for each category sequentially
    for (let i = 0; i < initialResults.length; i++) {
      const res = initialResults[i]
      const response = await fetchEffectiveness({
        from: new Date(dateFrom),
        to: new Date(dateTo),
        unitType,
        targetId: res.targetId,
        storeId: res.storeId,
        targetDateRangeType: rangeType
      })

      setResults(prev => {
        const updated = [...prev]
        if (response) {
          updated[i] = {
            ...updated[i],
            data: response.records,
            orderingMethodData: response.orderingMethodRecords,
            errorMessage: response.errorMessage,
            loading: false
          }
        } else {
          updated[i] = {
            ...updated[i],
            loading: false,
            errorMessage: '予期せぬエラーが発生しました。'
          }
        }
        return updated
      })
    }
    setLoading(false)
  }, [unitType, dateFrom, dateTo, rangeType, selectedSkus, selectedGroups, selectedDepartments, selectedLines, selectedClasses, selectedStores])

  const reset = () => {
    setUnitType(SkuMonitoringUnitType.Sku)
    setSelectedSkus([])
    setSelectedGroups([])
    setSelectedDepartments([])
    setSelectedLines([])
    setSelectedClasses([])
    setSelectedStores([])
    setResults([])
  }

  const orderingMethodColumns: Column[] = [
    { 
      key: 'orderingMethod', 
      label: '発注方式',
      render: (val) => (
        <span className="" style={{ color: getOrderingMethodTypeColor(val) }}>
          {getOrderingMethodTypeName(val)}
        </span>
      )
    },
    { key: 'averageStockQty', label: '平均在庫数', render: (val) => formatNumber(val), className: 'text-right' },
    { key: 'noStockCount', label: '欠品回数', render: (val) => `${formatNumber(val)} 回`, className: 'text-right' },
    { key: 'inventoryTurnoverRate', label: '在庫回転率', render: (val) => formatNumber(val), className: 'text-right' },
    { key: 'inventoryTurnoverDays', label: '在庫回転日数', render: (val) => formatNumber(val), className: 'text-right' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="効果測定"
        subtitle="AI需要予測と各発注方式のパフォーマンスを比較分析します"
      />

      {/* Modern Filter Card */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
        <div className="p-8">
          <div className="flex flex-col gap-8 xl:flex-row">
            {/* Left side: Selections */}
            <div className="flex-1 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Product Selection */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[15px] font-bold text-gray-700 uppercase tracking-widest">
                    <LayoutGrid className="h-4 w-4 text-indigo-500" />
                    対象商品
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={unitType}
                      onChange={(e) => setUnitType(Number(e.target.value))}
                      className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    >
                      {getSkuMonitoringUnitTypeOptions().map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsSkuModalOpen(true)}
                      className="rounded-2xl bg-gray-900 px-6 py-3 text-base font-bold text-white transition-all hover:bg-gray-800 whitespace-nowrap active:scale-95 shadow-sm"
                    >
                      選択
                    </button>
                  </div>
                  {/* Item Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {(unitType === SkuMonitoringUnitType.Sku ? selectedSkus : 
                      unitType === SkuMonitoringUnitType.Group ? selectedGroups :
                      unitType === SkuMonitoringUnitType.Department ? selectedDepartments :
                      unitType === SkuMonitoringUnitType.Line ? selectedLines : selectedClasses).map((item, idx) => (
                        <span key={idx} className="rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600">
                          {item.skuName || item.groupName || item.name}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Store Selection */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[15px] font-bold text-gray-700 uppercase tracking-widest">
                    <Store className="h-4 w-4 text-indigo-500" />
                    対象店舗
                  </label>
                  <button
                    onClick={() => setIsStoreModalOpen(true)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-3 text-base text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <span className="font-medium">{selectedStores.length > 0 ? `${selectedStores.length}店舗 選択中` : '店舗を選択してください'}</span>
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStores.map((store, idx) => (
                      <span key={idx} className="rounded-lg bg-gray-100 px-2 py-1 text-sm text-gray-600">
                        {store.storeName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[15px] font-bold text-gray-700 uppercase tracking-widest">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    対象期間
                  </label>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3">
                      <Datepicker 
                        value={dateFrom} 
                        onChange={setDateFrom} 
                        className="flex-1" 
                      />
                      <span className="text-gray-300 font-light text-xl">〜</span>
                      <Datepicker 
                        value={dateTo} 
                        onChange={setDateTo} 
                        className="flex-1" 
                      />
                    </div>
                  </div>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex flex-row items-center justify-end gap-3 pt-6 xl:flex-col xl:border-l xl:border-gray-100 xl:pl-8 xl:pt-0">
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-2xl px-6 py-3 text-base uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-50 whitespace-nowrap"
              >
                <RotateCcw className="h-4 w-4" />
                リセット
              </button>
              <button
                onClick={handleFetch}
                disabled={loading || selectedStores.length === 0}
                className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-10 py-4 text-lg text-white shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <TrendingUp className="h-5 w-5" />}
                画面表示
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="space-y-12">
        {results.map((res, idx) => (
          <div key={idx} className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/40 ring-1 ring-gray-100">
            {/* Box Header */}
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white uppercase tracking-wider">
                    {res.storeName}
                  </span>
                  <h2 className="text-xl font-black text-gray-900">
                    {res.targetName}
                    <span className="ml-3 text-base font-medium text-gray-400">({res.targetId})</span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-8">
              {res.loading ? (
                <div className="flex h-[500px] flex-col items-center justify-center text-gray-300">
                  <Loader2 className="mb-4 h-12 w-12 animate-spin" />
                  <p className="tracking-widest">データを読込中...</p>
                </div>
              ) : res.errorMessage ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl bg-red-50 text-red-400">
                  <AlertCircle className="mb-4 h-12 w-12" />
                  <p className="">{res.errorMessage}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Metrics Summary Table */}
                  <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <DataTable
                      columns={orderingMethodColumns}
                      data={res.orderingMethodData}
                      className="text-base"
                    />
                  </div>

                  {/* Line Chart */}
                  <div className="h-[500px] w-full rounded-2xl bg-gray-50/50 p-6 pt-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={res.data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="objectiveDate" 
                          tickFormatter={(val) => formatDate(val)}
                          label={{ value: '日付', position: 'insideBottomRight', offset: -10, fontSize: 12, fill: '#9ca3af' }}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          labelFormatter={(val) => formatDate(val)}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line name="販売数" type="monotone" dataKey="salesQty" stroke="#f43f5e" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line name="在庫数" type="monotone" dataKey="stockQty" stroke="#10b981" strokeWidth={3} dot={false} />
                        <Line name="推奨発注数" type="monotone" dataKey="orderQty" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <SelectObjectModal
        isOpen={isSkuModalOpen}
        onClose={() => setIsSkuModalOpen(false)}
        onSave={(items) => {
          if (unitType === SkuMonitoringUnitType.Sku) setSelectedSkus(items)
          else if (unitType === SkuMonitoringUnitType.Group) setSelectedGroups(items)
          else if (unitType === SkuMonitoringUnitType.Department) setSelectedDepartments(items)
          else if (unitType === SkuMonitoringUnitType.Line) setSelectedLines(items)
          else if (unitType === SkuMonitoringUnitType.Class) setSelectedClasses(items)
          setIsSkuModalOpen(false)
        }}
        title={`${getSkuMonitoringUnitTypeName(unitType)}を選択`}
        idKey={unitType === SkuMonitoringUnitType.Sku ? 'skuId' : unitType === SkuMonitoringUnitType.Group ? 'groupId' : 'id'}
        initialSelected={
          unitType === SkuMonitoringUnitType.Sku ? selectedSkus : 
          unitType === SkuMonitoringUnitType.Group ? selectedGroups : []
        }
        columns={[
          { key: unitType === SkuMonitoringUnitType.Sku ? 'skuId' : 'id', label: 'ID' },
          { key: unitType === SkuMonitoringUnitType.Sku ? 'skuName' : 'name', label: '名称' },
        ]}
        fetchItems={async (p) => {
          if (unitType === SkuMonitoringUnitType.Sku) return fetchSkuMasters(p)
          if (unitType === SkuMonitoringUnitType.Group) return fetchGroupMasters(p)
          if (unitType === SkuMonitoringUnitType.Department) return fetchDepartmentMasters(p)
          if (unitType === SkuMonitoringUnitType.Line) return fetchLineMasters(p)
          if (unitType === SkuMonitoringUnitType.Class) return fetchClassMasters(p)
          return null
        }}
      />

      <SelectObjectModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onSave={(items) => {
          setSelectedStores(items)
          setIsStoreModalOpen(false)
        }}
        title="店舗を選択"
        idKey="storeId"
        initialSelected={selectedStores}
        columns={[
          { key: 'storeId', label: '店舗ID' },
          { key: 'storeName', label: '店舗名' }
        ]}
        fetchItems={fetchStoreMasters}
      />
    </div>
  )
}
