'use client'

import { useState, useEffect, useCallback } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Calendar, RotateCcw, Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import Datepicker from '@/components/Datepicker'
import { fetchStockAlerts, SkuAlert } from '@/lib/api/endpoints'
import { formatDate, formatNumber, getSkuAlertTypeName } from '@/types/enums'

const PER_PAGE = 20

const columns: Column<SkuAlert>[] = [
  {
    key: 'date',
    label: '対象日',
    sortable: true,
    render: (val: string) => (
      <span className="font-medium text-gray-700">{formatDate(val)}</span>
    ),
  },
  {
    key: 'storeId',
    label: '店舗',
    render: (_val: string, row: SkuAlert) =>
      row.storeSkuMaster?.storeMaster?.storeName ?? row.storeId,
  },
  {
    key: 'skuId',
    label: 'SKU',
    render: (_val: string, row: SkuAlert) => (
      <span className="font-medium text-gray-900">
        {row.storeSkuMaster?.skuName ?? row.skuId}
      </span>
    ),
  },
  {
    key: 'skuAlertType',
    label: '種類',
    render: (val: string) => (
      <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/10">
        {getSkuAlertTypeName(val)}
      </span>
    ),
  },
]

function StockAlertContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [stockAlerts, setStockAlerts] = useState<SkuAlert[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (p: number, f?: string, t?: string) => {
    setLoading(true)
    const activeFrom = f !== undefined ? f : from
    const activeTo = t !== undefined ? t : to
    
    const response = await fetchStockAlerts({
      page: p,
      perPage: PER_PAGE,
      from: activeFrom ? new Date(activeFrom) : null,
      to: activeTo ? new Date(activeTo) : null,
    })
    setLoading(false)
    if (response) {
      setStockAlerts(response.data)
      setTotal(response.total)
    }
  }, [from, to])

  useEffect(() => {
    // If we have search params, we use them for initial fetch
    const pFrom = searchParams.get('from') || ''
    const pTo = searchParams.get('to') || ''
    // eslint-disable-next-line
    fetchData(1, pFrom || undefined, pTo || undefined)
  }, [searchParams, fetchData])

  function handleSearch() {
    setPage(1)
    fetchData(1)
  }

  function reset() {
    setFrom('')
    setTo('')
    setPage(1)
    fetchData(1)
  }

  function handlePageChange(p: number) {
    setPage(p)
    fetchData(p)
  }

  return (
    <div className="space-y-8">
      <PageHeader title="在庫アラートリスト" subtitle="在庫数に基づくアラートを検索・確認します" />

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 flex flex-col sm:flex-row items-start sm:items-center p-3 gap-4">
        
        {/* Left Side: Icon & Label */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-[15px] font-bold text-gray-700 whitespace-nowrap hidden sm:inline-block">対象期間</span>
        </div>

        {/* Date Inputs */}
        <div className="flex items-center gap-2">
          <Datepicker 
            value={from} 
            onChange={setFrom} 
            className="w-48 sm:w-56" 
          />
          <span className="text-gray-300">〜</span>
          <Datepicker 
            value={to} 
            onChange={setTo} 
            className="w-48 sm:w-56" 
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex w-full sm:w-auto items-center gap-3">
          <button
            onClick={reset}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-[15px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-2 text-[15px] font-bold text-white hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            検索
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] ring-1 ring-gray-200">
        <DataTable
          columns={columns}
          data={stockAlerts}
          emptyMessage="該当する在庫アラートは見つかりませんでした。"
        />

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <span className="text-base text-gray-500">
              全 {formatNumber(total)} 件のご確認
            </span>
            <Pagination
              currentPage={page}
              totalItems={total}
              perPage={PER_PAGE}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Back Button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-base text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          ダッシュボードへ戻る
        </button>
      </div>
    </div>
  )
}

export default function StockAlertPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">読み込み中...</div>}>
      <StockAlertContent />
    </Suspense>
  )
}
