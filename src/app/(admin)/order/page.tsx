'use client'

import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Search, Download } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import { fetchOrders, downloadEvidence, OrderRecord } from '@/lib/api/endpoints'
import { formatDate, formatNumber } from '@/types/enums'

const PER_PAGE = 20

export default function OrderPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)

  const columns: Column<OrderRecord>[] = [
    {
      key: 'date',
      label: '発注日',
      sortable: true,
      render: (val: string) => <span className="font-medium text-gray-700">{formatDate(val)}</span>,
    },
    {
      key: 'arrivalDate',
      label: '納品日',
      render: (val: string | null) => <span className="text-gray-600">{val ? formatDate(val) : '—'}</span>,
    },
    {
      key: 'storeName',
      label: '店舗名',
    },
    {
      key: 'skuId',
      label: 'SKU',
      render: (val: string) => <span className="font-mono text-sm text-gray-600">{val}</span>,
    },
    {
      key: 'skuName',
      label: '商品名',
      render: (val: string) => <span className="font-medium text-gray-900">{val}</span>,
    },
    { key: 'department', label: '部門', render: () => <span className="text-gray-400">—</span> },
    { key: 'category_medium', label: '中分類', render: () => <span className="text-gray-400">—</span> },
    { key: 'category_small', label: '小分類', render: () => <span className="text-gray-400">—</span> },
    { key: 'category_detail', label: '細分類', render: () => <span className="text-gray-400">—</span> },
    {
      key: 'orderQty',
      label: '発注推奨数',
      render: (val: number) => <span className="text-right font-medium">{formatNumber(val)}</span>,
      className: 'text-right',
    },
    {
      key: 'correctedOrderQty',
      label: '実発注数',
      render: (val: number | null, row: OrderRecord) => {
        return (
          <span className="">
            {val !== null ? formatNumber(val) : formatNumber(row.orderQty)}
          </span>
        )
      },
      className: 'text-right',
    },
  ]

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const response = await fetchOrders({
      page: p,
      perPage: PER_PAGE,
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
    })
    setLoading(false)
    if (response) {
      setOrders(response.data)
      setTotal(response.total)
    }
  }, [from, to])

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
    setPage(1)
    fetchData(1)
  }

  async function handleExport() {
    const blob = await downloadEvidence({ evidenceId: 'all' })
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `evidence_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="発注修正" subtitle="発注数量の確認・修正を行います" />

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end">
          <div className="grid gap-4 sm:grid-cols-2 lg:flex lg:items-center">
            <div className="flex items-center gap-3">
              <label className="whitespace-nowrap text-base text-gray-700">対象単位</label>
              <select className="w-32 rounded border border-gray-300 bg-white px-2 py-2 text-base text-gray-700 focus:border-indigo-500 focus:outline-none">
                <option value="1">SKU</option>
              </select>
              <button className="shrink-0 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-5 py-2 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">選択</button>
            </div>
            <div className="flex items-center gap-3">
              <label className="whitespace-nowrap text-base text-gray-700">対象店舗</label>
              <select className="w-32 rounded border border-gray-300 bg-white px-2 py-2 text-base text-gray-700 focus:border-indigo-500 focus:outline-none">
                <option value="1">店舗別</option>
              </select>
              <button className="shrink-0 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-5 py-2 text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">選択</button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 xl:ml-4">
            <label className="whitespace-nowrap text-base text-gray-700">対象期間</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded border border-gray-300 bg-white px-2 py-0.5">

                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-56 py-1 text-base focus:outline-none bg-white"
                />
              </div>
              <span className="text-gray-400">～</span>
              <div className="flex items-center gap-2 rounded border border-gray-300 bg-white px-2 py-0.5">

                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-56 py-1 text-base focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions - New Line */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-base text-gray-600 transition-colors hover:bg-gray-100 whitespace-nowrap">
            <RotateCcw className="h-4 w-4" /> リセット
          </button>
          <button onClick={handleSearch} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60 whitespace-nowrap">
            <Search className="h-4 w-4" /> 検索
          </button>
          <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 text-base font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 whitespace-nowrap">
            <Download className="h-4 w-4" /> CSV出力
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <DataTable columns={columns} data={orders} emptyMessage="該当する発注データは見つかりませんでした。" />
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
