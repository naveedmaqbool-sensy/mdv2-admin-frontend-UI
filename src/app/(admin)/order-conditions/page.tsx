'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Search, Download, Pencil } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Datepicker from '@/components/Datepicker'
import Pagination from '@/components/Pagination'
import { fetchOrderConditions, OrderCondition } from '@/lib/api/endpoints'
import { formatDate, formatNumber } from '@/types/enums'

const PER_PAGE = 20

export default function OrderConditionsPage() {
  const router = useRouter()
  const [conditions, setConditions] = useState<OrderCondition[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)

  const columns: Column<OrderCondition>[] = [
    {
      key: 'actions',
      label: '操作',
      render: (_val: any, row: OrderCondition) => (
        <button
          onClick={e => { e.stopPropagation(); router.push(`/order-conditions/${row.id}`) }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-indigo-600 transition-colors hover:bg-indigo-50"
        >
          <Pencil className="h-3.5 w-3.5" /> 編集
        </button>
      ),
    },
    { key: 'storeName', label: '店舗' },
    {
      key: 'skuId',
      label: 'JAN',
      render: (val: string) => <span className="font-mono text-sm text-gray-600">{val}</span>,
    },
    {
      key: 'skuName',
      label: '商品名',
      render: (val: string) => <span className="font-medium text-gray-900">{val}</span>,
    },
    { key: 'deliveryPriority', label: '配送優先度' },
    {
      key: 'leadTimeDays',
      label: 'リードタイム',
      render: (val: number) => `${val}日`,
    },
    {
      key: 'minimumOrderQty',
      label: '最低発注数',
      render: (val: number) => formatNumber(val),
      className: 'text-right',
    },
    {
      key: 'safetyStockDays',
      label: '安全在庫日数',
      render: (val: number | null) => val !== null ? `${val}日` : '—',
    },
    {
      key: 'endOfSaleDate',
      label: '終売日',
      render: (val: string | null) => val ? formatDate(val) : '—',
    },
  ]

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const response = await fetchOrderConditions({
      page: p,
      perPage: PER_PAGE,
      search: searchText || undefined,
      skuId: undefined,
      storeId: undefined,
    })
    setLoading(false)
    if (response) {
      setConditions(response.data)
      setTotal(response.total)
    }
  }, [searchText])

  useEffect(() => { 
    // eslint-disable-next-line
    fetchData(1) 
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch() {
    setPage(1)
    fetchData(1)
  }

  function handleReset() {
    setFrom('')
    setTo('')
    setSearchText('')
    setPage(1)
    fetchData(1)
  }

  return (
    <div className="space-y-8">
      <PageHeader title="商品別発注条件" subtitle="発注条件マスタの検索・確認・編集を行います" />

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="whitespace-nowrap text-gray-700 sm:w-20 sm:text-right">期間</label>
            <div className="flex items-center gap-2">
              <Datepicker value={from} onChange={setFrom} className="w-64" />
              <span className="text-gray-400">～</span>
              <Datepicker value={to} onChange={setTo} className="w-64" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row">
            <div className="flex gap-3">
              <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-base text-gray-600 transition-colors hover:bg-gray-100">
                <RotateCcw className="h-4 w-4" /> リセット
              </button>
              <button onClick={handleSearch} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-base text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60">
                <Search className="h-4 w-4" /> 検索する
              </button>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg border border-indigo-300 bg-white px-4 py-2.5 text-base text-indigo-600 shadow-sm hover:bg-indigo-50">
              <Download className="h-4 w-4" /> CSV出力
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <DataTable columns={columns} data={conditions} emptyMessage="該当する発注条件データは見つかりませんでした。" />
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <span className="text-base text-gray-500">全 {formatNumber(total)} 件</span>
            <Pagination currentPage={page} totalItems={total} perPage={PER_PAGE} onPageChange={p => { setPage(p); fetchData(p) }} />
          </div>
        )}
      </div>
    </div>
  )
}
