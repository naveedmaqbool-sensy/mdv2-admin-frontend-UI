'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, RotateCcw, Search } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import { fetchThresholdConfigs, deleteThresholdConfig, ThresholdConfig } from '@/lib/api/endpoints'
import { formatNumber, getMonitoringTypeName, MonitoringType, getSkuMonitoringUnitTypeName, SkuMonitoringUnitType, getStoreMonitoringUnitTypeName, StoreMonitoringUnitType } from '@/types/enums'

const PER_PAGE = 20

export default function ConfigPage() {
  const router = useRouter()
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ThresholdConfig | null>(null)

  // Form state for adding new threshold
  const [formName, setFormName] = useState('')
  const [formMonitoringType, setFormMonitoringType] = useState<number>(MonitoringType.OrderQty)
  const [formThreshold, setFormThreshold] = useState('')
  const [formSkuUnit, setFormSkuUnit] = useState<number>(SkuMonitoringUnitType.Sku)
  const [formStoreUnit, setFormStoreUnit] = useState<number>(StoreMonitoringUnitType.All)
  const [formIsAllTarget, setFormIsAllTarget] = useState(true)

  const columns: Column<ThresholdConfig>[] = [
    {
      key: 'name',
      label: 'アラート名称',
      sortable: true,
      render: (val: string) => <span className="font-medium text-gray-900">{val}</span>,
    },
    {
      key: 'monitoringType',
      label: 'アラート種類',
      render: (val: number) => (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-700">
          {getMonitoringTypeName(val as MonitoringType)}
        </span>
      ),
    },
    { key: 'threshold', label: '閾値' },
    {
      key: 'skuMonitoringUnitType',
      label: '対象単位',
      render: (val: number | null) => val ? getSkuMonitoringUnitTypeName(val as SkuMonitoringUnitType) : '—',
    },
    {
      key: 'storeMonitoringUnitType',
      label: '対象店舗',
      render: (val: number | null) => val ? getStoreMonitoringUnitTypeName(val as StoreMonitoringUnitType) : '全店計',
    },
    {
      key: 'actions',
      label: '操作',
      render: (_val: any, row: ThresholdConfig) => (
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/config/${row.id}`) }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Pencil className="h-3.5 w-3.5" />
            編集
          </button>
          <button
            onClick={e => { e.stopPropagation(); setDeleteTarget(row) }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            削除
          </button>
        </div>
      ),
    },
  ]

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response = await fetchThresholdConfigs()
    setLoading(false)
    if (response && Array.isArray(response)) {
      setThresholds(response)
      setTotal(response.length)
    }
  }, [])

  useEffect(() => { fetchData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteThresholdConfig(deleteTarget.id)
    setDeleteTarget(null)
    fetchData()
  }

  return (
    <div className="space-y-8">
      <PageHeader title="アラート閾値設定" subtitle="ダッシュボードに表示するアラートの閾値を登録・管理します" />

      {/* Add New Threshold Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="space-y-5">
          {/* Alert Name */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="whitespace-nowrap text-gray-700 sm:w-32 sm:text-right">アラート名称</label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="max-w-lg flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Alert Type & Threshold */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="whitespace-nowrap text-gray-700 sm:w-32 sm:text-right">アラート種類</label>
            <div className="flex items-center gap-6">
              <select
                value={formMonitoringType}
                onChange={e => setFormMonitoringType(Number(e.target.value))}
                className="w-64 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {[1,2,3,4,5,6].map(v => (
                  <option key={v} value={v}>{v}: {getMonitoringTypeName(v as MonitoringType)}</option>
                ))}
              </select>
              <label className="whitespace-nowrap text-gray-700">閾値</label>
              <input
                type="number"
                value={formThreshold}
                onChange={e => setFormThreshold(e.target.value)}
                className="w-32 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Target Unit */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="whitespace-nowrap text-gray-700 sm:w-32 sm:text-right">対象単位</label>
            <div className="flex items-center gap-4">
              <select
                value={formSkuUnit}
                onChange={e => setFormSkuUnit(Number(e.target.value))}
                className="w-48 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {[1,2,3,4,5].map(v => (
                  <option key={v} value={v}>{v}: {getSkuMonitoringUnitTypeName(v as SkuMonitoringUnitType)}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-base text-gray-700">
                <input
                  type="checkbox"
                  checked={formIsAllTarget}
                  onChange={e => setFormIsAllTarget(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                全選択
              </label>
            </div>
          </div>

          {/* Target Store */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="whitespace-nowrap text-gray-700 sm:w-32 sm:text-right">対象店舗</label>
            <select
              value={formStoreUnit}
              onChange={e => setFormStoreUnit(Number(e.target.value))}
              className="w-48 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value={1}>1: 全店計</option>
              <option value={2}>2: 店舗別</option>
            </select>
          </div>

          {/* Add Button */}
          <div className="flex justify-end border-t border-gray-100 pt-4">
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-base text-white shadow-sm transition-all hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              追加
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <DataTable columns={columns} data={thresholds} emptyMessage="設定された閾値ルールはありません。" />
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <span className="text-base text-gray-500">全 {formatNumber(total)} 件のご確認</span>
            <Pagination currentPage={page} totalItems={total} perPage={PER_PAGE} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="閾値削除"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-base text-gray-700 shadow-sm hover:bg-gray-50">キャンセル</button>
            <button onClick={handleDelete} className="rounded-lg bg-red-600 px-5 py-2 text-base text-white shadow-sm hover:bg-red-700">削除する</button>
          </>
        }
      >
        <p className="text-gray-700">
          閾値 <span className="">{deleteTarget?.name}</span> を削除します。<br />本当によろしいですか？
        </p>
      </Modal>
    </div>
  )
}
