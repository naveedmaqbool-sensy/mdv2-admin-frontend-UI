'use client'

import { Search, Download } from 'lucide-react'
import Modal from '@/components/Modal'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import { MonitoringDetail } from '@/lib/api/endpoints'
import { formatDate, formatNumber } from '@/types/enums'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (text: string, page: number) => void
  onExportCsv: () => void
  title: string
  items: MonitoringDetail[]
  total: number
  page: number
  perPage: number
  searchText: string
  setSearchText: (text: string) => void
  loading?: boolean
}

const columns: Column<MonitoringDetail>[] = [
  {
    key: 'date',
    label: '日付',
    render: (val: string) => <span className="text-gray-600">{formatDate(val)}</span>,
  },
  {
    key: 'storeId',
    label: '店舗ID',
  },
  {
    key: 'storeName',
    label: '店舗名称',
  },
  {
    key: 'departmentName',
    label: '中分類',
  },
  {
    key: 'skuId',
    label: 'SKU ID',
    render: (val: string) => <span className="font-medium text-gray-900">{val}</span>,
  },
  {
    key: 'skuName',
    label: '商品名称',
  },
  {
    key: 'recommendedOrderQty',
    label: '発注推奨数',
    render: (val: number) => <span className="text-right">{formatNumber(val)}</span>,
    className: 'text-right',
  },
  {
    key: 'actualOrderQty',
    label: '発注数',
    render: (val: number) => <span className="text-right font-medium text-indigo-600">{formatNumber(val)}</span>,
    className: 'text-right',
  },
  {
    key: 'differenceOrderQty',
    label: '差異',
    render: (val: number) => (
      <span className={val > 0 ? "text-rose-600" : "text-gray-900"}>
        {val > 0 ? `+${formatNumber(val)}` : formatNumber(val)}
      </span>
    ),
    className: 'text-right',
  },
]

export default function DetailModal({
  isOpen,
  onClose,
  onSearch,
  onExportCsv,
  title,
  items,
  total,
  page,
  perPage,
  searchText,
  setSearchText,
  loading = false,
}: DetailModalProps) {
  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(searchText, 1)
  }

  const footer = (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
        {total > 0 && (
          <Pagination
            currentPage={page}
            totalItems={total}
            perPage={perPage}
            onPageChange={(p) => onSearch(searchText, p)}
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-base text-gray-600 transition-colors hover:bg-gray-100"
        >
          閉じる
        </button>
        <button
          onClick={onExportCsv}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-base text-white shadow-sm transition-all hover:bg-gray-800"
        >
          <Download className="h-4 w-4" />
          CSV出力
        </button>
      </div>
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="xl">
      <div className="space-y-6">
        {/* Detail Search */}
        <form onSubmit={handleSearchSubmit} className="flex justify-end gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="SKU名やIDで検索..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-base text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            検索
          </button>
        </form>

        {/* Info Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <DataTable
            columns={columns}
            data={items}
            emptyMessage="明細情報が見つかりませんでした"
          />
        </div>
      </div>
    </Modal>
  )
}
