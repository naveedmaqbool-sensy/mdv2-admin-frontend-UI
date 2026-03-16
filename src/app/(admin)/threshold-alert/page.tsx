'use client'

import { useState, useEffect, useCallback } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, RotateCcw, Search, Eye, Calendar } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import Datepicker from '@/components/Datepicker'
import { fetchThresholdAlerts, fetchThresholdAlertTargets, AdminAlert, AdminAlertTarget } from '@/lib/api/endpoints'
import { formatDate, formatNumber, getMonitoringTypeName, MonitoringType, SkuMonitoringUnitType, StoreMonitoringUnitType } from '@/types/enums'

const PER_PAGE = 20

function getSkuTarget(alert: AdminAlert): string {
  const targets = alert.adminAlertTargets ?? []
  switch (alert.skuMonitoringUnitType) {
    case SkuMonitoringUnitType.Sku:
      return `${targets.filter(v => v.skuId).length} 件の商品`
    case SkuMonitoringUnitType.Group:
      return `${targets.filter(v => v.groupId).length} 件の部門`
    case SkuMonitoringUnitType.Department:
      return `${targets.filter(v => v.departmentId).length} 件の中分類`
    case SkuMonitoringUnitType.Line:
      return `${targets.filter(v => v.lineId).length} 件の小分類`
    case SkuMonitoringUnitType.Class:
      return `${targets.filter(v => v.classId).length} 件の細分類`
    default:
      return ''
  }
}

function getStoreTarget(alert: AdminAlert): string {
  switch (alert.storeMonitoringUnitType) {
    case StoreMonitoringUnitType.All:
      return '全店舗'
    case StoreMonitoringUnitType.Store:
      return `${(alert.adminAlertTargets ?? []).filter(v => v.storeId).length} 件の店舗`
    default:
      return ''
  }
}

function ThresholdAlertContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [alerts, setAlerts] = useState<AdminAlert[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')
  const [loading, setLoading] = useState(false)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState(0) // 0=items, 1=stores
  const [targets, setTargets] = useState<AdminAlertTarget[]>([])
  const [targetTotal, setTargetTotal] = useState(0)
  const [targetPage, setTargetPage] = useState(1)
  const [targetAlertId, setTargetAlertId] = useState<string>('')

  const columns: Column<AdminAlert>[] = [
    {
      key: 'objectiveDate',
      label: '対象日',
      sortable: true,
      render: (val: string) => <span className="font-medium text-gray-700">{formatDate(val)}</span>,
    },
    {
      key: 'monitoringType',
      label: 'アラート種類',
      render: (val: number) => (
        <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/10">
          {getMonitoringTypeName(val as MonitoringType)}
        </span>
      ),
    },
    {
      key: 'threshold',
      label: '閾値',
    },
    {
      key: 'skuMonitoringUnitType',
      label: '対象単位',
      render: (_val: number, row: AdminAlert) => (
        <span className="text-gray-800">{getSkuTarget(row)}</span>
      ),
    },
    {
      key: 'storeMonitoringUnitType',
      label: '対象店舗',
      render: (_val: number, row: AdminAlert) => (
        <span className="text-gray-800">{getStoreTarget(row)}</span>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (_val: Record<string, unknown>, row: AdminAlert) => (
        <button
          onClick={e => { e.stopPropagation(); openTargetModal(row) }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-all hover:bg-gray-50"
        >
          <Eye className="h-3.5 w-3.5" />
          対象を確認
        </button>
      ),
    },
  ]

  const fetchData = useCallback(async (p: number, f?: string, t?: string) => {
    setLoading(true)
    const activeFrom = f !== undefined ? f : from
    const activeTo = t !== undefined ? t : to

    const response = await fetchThresholdAlerts({
      page: p,
      perPage: PER_PAGE,
      from: activeFrom ? new Date(activeFrom) : null,
      to: activeTo ? new Date(activeTo) : null,
    })
    setLoading(false)
    if (response) {
      setAlerts(response.data)
      setTotal(response.total)
    }
  }, [from, to])

  useEffect(() => {
    const pFrom = searchParams.get('from') || ''
    const pTo = searchParams.get('to') || ''
    fetchData(1, pFrom || undefined, pTo || undefined)
  }, [searchParams, fetchData])

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

  function handlePageChange(p: number) {
    setPage(p)
    fetchData(p)
  }

  async function openTargetModal(alert: AdminAlert) {
    setTargetAlertId(alert.id)
    setModalTab(0)
    setTargetPage(1)
    const response = await fetchThresholdAlertTargets({
      id: alert.id,
      page: 1,
      perPage: PER_PAGE,
      isStore: false,
    })
    if (response) {
      setTargets(response.data)
      setTargetTotal(response.total)
      setShowModal(true)
    }
  }

  async function handleTargetTab(tabIndex: number) {
    setModalTab(tabIndex)
    setTargetPage(1)
    const response = await fetchThresholdAlertTargets({
      id: targetAlertId,
      page: 1,
      perPage: PER_PAGE,
      isStore: tabIndex === 1,
    })
    if (response) {
      setTargets(response.data)
      setTargetTotal(response.total)
    }
  }

  async function handleTargetPageChange(p: number) {
    setTargetPage(p)
    const response = await fetchThresholdAlertTargets({
      id: targetAlertId,
      page: p,
      perPage: PER_PAGE,
      isStore: modalTab === 1,
    })
    if (response) {
      setTargets(response.data)
      setTargetTotal(response.total)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="閾値アラートリスト" subtitle="設定した閾値を超過したアラートを検索・確認します" />

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
            onClick={handleReset}
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
          data={alerts}
          emptyMessage="該当する閾値アラートは見つかりませんでした。"
        />
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <span className="text-base text-gray-500">全 {formatNumber(total)} 件のご確認</span>
            <Pagination currentPage={page} totalItems={total} perPage={PER_PAGE} onPageChange={handlePageChange} />
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

      {/* Target Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="対象詳細の確認"
        size="lg"
        footer={
          <div className="flex w-full items-center justify-between">
            <Pagination
              currentPage={targetPage}
              totalItems={targetTotal}
              perPage={PER_PAGE}
              onPageChange={handleTargetPageChange}
            />
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-base text-gray-700 shadow-sm hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        }
      >
        {/* Tabs */}
        <div className="mb-5 flex gap-1 rounded-lg bg-gray-100/80 p-1">
          {['対象アイテム', '対象店舗'].map((tab, i) => (
            <button
              key={tab}
              onClick={() => handleTargetTab(i)}
              className={
                modalTab === i
                  ? 'flex-1 rounded-md bg-white py-1.5 text-base text-gray-900 shadow-sm'
                  : 'flex-1 rounded-md py-1.5 text-base text-gray-500 hover:text-gray-700'
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <DataTable
          columns={[{ key: 'targetName', label: '登録名称', render: (val: string) => <span className="font-medium text-gray-700">{val}</span> }]}
          data={targets}
          idKey="id"
        />
      </Modal>
    </div>
  )
}

export default function ThresholdAlertPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">読み込み中...</div>}>
      <ThresholdAlertContent />
    </Suspense>
  )
}
