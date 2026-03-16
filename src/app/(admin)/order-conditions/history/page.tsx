'use client'

import { useState, useEffect, useCallback } from 'react'
import { RotateCcw, Search, Download } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Datepicker from '@/components/Datepicker'
import Pagination from '@/components/Pagination'
import { fetchOrderConditionHistories, OrderConditionHistory } from '@/lib/api/endpoints'
import { formatDate, formatNumber } from '@/types/enums'

const PER_PAGE = 20

// Mock Status Types ported from Vue
const StatusTypes: Record<string, { label: string, color: string }> = {
  '1': { label: '受付済', color: 'bg-gray-100 text-gray-700' },
  '2': { label: '処理中', color: 'bg-blue-100 text-blue-700' },
  '3': { label: '完了', color: 'bg-emerald-100 text-emerald-700' },
  '4': { label: 'エラー終了', color: 'bg-red-100 text-red-700' },
}

export default function OrderConditionsHistoryPage() {
  const [histories, setHistories] = useState<OrderConditionHistory[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  
  // Filter states
  const [uploadedDate, setUploadedDate] = useState('')
  const [userName, setUserName] = useState('')
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(false)

  const columns: Column<OrderConditionHistory>[] = [
    {
      key: 'createdAt',
      label: '登録日時',
      render: (val: string) => <span className="text-gray-600">{formatDate(val)}</span>,
    },
    {
      key: 'createdBy',
      label: '作業者',
      render: (val: string) => <span className="font-medium text-gray-900">{val}</span>,
    },
    {
      key: 'values',
      label: '更新内容',
      render: (_: unknown, row: OrderConditionHistory) => (
        <button 
          onClick={() => handleDownloadValues(row.id)}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50"
        >
          <Download className="h-3.5 w-3.5" />
          変更内容CSV
        </button>
      )
    },
    {
      key: 'targetSkuCount',
      label: '対象SKU件数',
      render: (val: number) => <span className="text-gray-900">{formatNumber(val)}件</span>,
      className: 'text-right'
    },
    {
      key: 'targetStoreCount',
      label: '対象店舗件数',
      render: (val: number) => <span className="text-gray-900">{formatNumber(val)}件</span>,
      className: 'text-right'
    },
    {
      key: 'errorFile',
      label: 'エラーファイル',
      render: (_: unknown, row: OrderConditionHistory) => (
        row.hasError ? (
          <button 
            onClick={() => handleDownloadErrors(row.id)}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50"
          >
            <Download className="h-3.5 w-3.5" />
            エラーCSV
          </button>
        ) : <span className="text-gray-400">—</span>
      )
    },
    {
      key: 'status',
      label: '状態',
      render: (val: string | number) => {
        const status = StatusTypes[val.toString()] || { label: '不明', color: 'bg-gray-100 text-gray-700' }
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm ${status.color}`}>
            {status.label}
          </span>
        )
      }
    },
  ]

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const response = await fetchOrderConditionHistories({
      page: p,
      perPage: PER_PAGE,
      from: uploadedDate ? new Date(uploadedDate) : null,
      to: uploadedDate ? new Date(uploadedDate) : null,
    })
    setLoading(false)
    if (response) {
      setHistories(response.data)
      setTotal(response.total)
    }
  }, [uploadedDate])

  useEffect(() => { 
    // eslint-disable-next-line
    fetchData(1) 
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch() {
    setPage(1)
    fetchData(1)
  }

  function handleReset() {
    setUploadedDate('')
    setUserName('')
    setHasError(false)
    setPage(1)
    fetchData(1)
  }

  // Download Mock Handlers
  async function handleDownloadValues(id: string) {
    console.log('Downloading values for id:', id)
    // apiOrderConditionsHistoryValueDownload endpoint logic
  }

  async function handleDownloadErrors(id: string) {
    console.log('Downloading errors for id:', id)
    // apiOrderConditionsHistoryErrorDownload endpoint logic 
  }

  return (
    <div className="space-y-8">
      <PageHeader title="発注条件マスタ 一括更新履歴" subtitle="過去のCSVや一括画面からの更新履歴を確認します" />

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          
          <div className="flex flex-1 flex-wrap gap-6">
            <div className="space-y-2">
              <label className="text-base text-gray-700">更新登録日</label>
              <Datepicker value={uploadedDate} onChange={setUploadedDate} className="w-64" />
            </div>
            
            <div className="space-y-2">
              <label className="text-base text-gray-700">作業者</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="氏名を入力"
                className="w-48 rounded-lg border border-gray-200 px-3 py-2.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-base text-gray-700">ステータス</label>
              <div className="flex h-[42px] items-center">
                <label className="flex cursor-pointer items-center gap-2 text-base text-gray-700">
                  <input
                    type="checkbox"
                    checked={hasError}
                    onChange={e => setHasError(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span>エラーを含む</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-base text-gray-600 transition-colors hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4" />
              リセット
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-base text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              検索
            </button>
          </div>
          
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <DataTable
          columns={columns}
          data={histories}
          emptyMessage="該当する履歴は見つかりませんでした。"
        />
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <span className="text-base text-gray-500">全 {formatNumber(total)} 件</span>
            <Pagination
              currentPage={page}
              totalItems={total}
              perPage={PER_PAGE}
              onPageChange={p => { setPage(p); fetchData(p) }}
            />
          </div>
        )}
      </div>

    </div>
  )
}
