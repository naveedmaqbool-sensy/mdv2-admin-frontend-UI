'use client'

import { useState } from 'react'
import { Download, X } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Datepicker from '@/components/Datepicker'
import Modal from '@/components/Modal'
import DataTable from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import { downloadEvidence, fetchSkuMasters, fetchStoreMasters, SkuMaster, StoreMaster } from '@/lib/api/endpoints'

const PER_PAGE = 20

export default function EvidenceExportPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selectedSkus, setSelectedSkus] = useState<SkuMaster[]>([])
  const [selectedStores, setSelectedStores] = useState<StoreMaster[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Sku Modal State
  const [showSkuModal, setShowSkuModal] = useState(false)
  const [skus, setSkus] = useState<SkuMaster[]>([])
  const [skuTotal, setSkuTotal] = useState(0)
  const [skuPage, setSkuPage] = useState(1)
  const [skuSearch, setSkuSearch] = useState('')

  // Store Modal State
  const [showStoreModal, setShowStoreModal] = useState(false)
  const [stores, setStores] = useState<StoreMaster[]>([])
  const [storeTotal, setStoreTotal] = useState(0)
  const [storePage, setStorePage] = useState(1)
  const [storeSearch, setStoreSearch] = useState('')

  async function handleExport() {
    setError(null)
    if (!from || !to) {
      setError('対象期間を指定してください。')
      return
    }
    if (selectedSkus.length === 0) {
      setError('対象商品を指定してください。')
      return
    }
    if (selectedSkus.length > 1) {
      setError('対象商品を1つに絞り込んでください。')
      return
    }
    if (selectedStores.length === 0) {
      setError('対象店舗を指定してください。')
      return
    }
    if (selectedStores.length > 1) {
      setError('対象店舗を1つに絞り込んでください。')
      return
    }

    setLoading(true)
    const blob = await downloadEvidence({ evidenceId: 'selected' }) // Placeholder ID until API is wired for these specific params
    setLoading(false)

    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `evidence_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // ---- SKU Modal logic ----
  async function loadSkus(p: number, search?: string) {
    const res = await fetchSkuMasters({ page: p, perPage: PER_PAGE, text: search || undefined })
    if (res) {
      setSkus(res.data)
      setSkuTotal(res.total)
    }
  }
  function openSkuModal() {
    setSkuPage(1)
    setSkuSearch('')
    loadSkus(1, '')
    setShowSkuModal(true)
  }
  function handleSkuSelect(sku: SkuMaster) {
    setSelectedSkus([sku])
    setShowSkuModal(false)
  }

  // ---- Store Modal logic ----
  async function loadStores(p: number, search?: string) {
    const res = await fetchStoreMasters({ page: p, perPage: PER_PAGE, text: search || undefined })
    if (res) {
      setStores(res.data)
      setStoreTotal(res.total)
    }
  }
  function openStoreModal() {
    setStorePage(1)
    setStoreSearch('')
    loadStores(1, '')
    setShowStoreModal(true)
  }
  function handleStoreSelect(store: StoreMaster) {
    setSelectedStores([store])
    setShowStoreModal(false)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader title="発注推奨数エビデンス出力" subtitle="発注推奨数の根拠となるエビデンスデータを出力します" />

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-base font-medium text-red-800 ring-1 ring-inset ring-red-200">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Target Date */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-32 shrink-0">
              <label className="text-base text-gray-700">対象期間</label>
            </div>
            <div className="flex items-center gap-2">
              <Datepicker value={from} onChange={setFrom} className="w-64" />
              <span className="text-gray-400">～</span>
              <Datepicker value={to} onChange={setTo} className="w-64" />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Target SKU */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="w-32 shrink-0 pt-2">
              <label className="text-base text-gray-700">対象商品</label>
            </div>
            <div className="flex-1 space-y-3">
              <button
                onClick={openSkuModal}
                className="rounded-lg bg-indigo-50 px-4 py-2 text-base text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                選択する
              </button>
              {selectedSkus.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSkus.map(sku => (
                    <span key={sku.skuId} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-base font-medium text-gray-700">
                      {sku.skuName}
                      <button onClick={() => setSelectedSkus([])} className="text-gray-400 hover:text-gray-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Target Store */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="w-32 shrink-0 pt-2">
              <label className="text-base text-gray-700">対象店舗</label>
            </div>
            <div className="flex-1 space-y-3">
              <button
                onClick={openStoreModal}
                className="rounded-lg bg-indigo-50 px-4 py-2 text-base text-indigo-700 transition-colors hover:bg-indigo-100"
              >
                選択する
              </button>
              {selectedStores.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedStores.map(store => (
                    <span key={store.storeId} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-base font-medium text-gray-700">
                      {store.storeName}
                      <button onClick={() => setSelectedStores([])} className="text-gray-400 hover:text-gray-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-base text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            出力する
          </button>
        </div>
      </div>

      {/* SKU Selection Modal */}
      <Modal
        isOpen={showSkuModal}
        onClose={() => setShowSkuModal(false)}
        title="対象商品の選択"
        size="xl"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="商品名やJANコードで検索"
            value={skuSearch}
            onChange={e => setSkuSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadSkus(1, skuSearch)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="max-h-[60vh] min-h-[400px] overflow-y-auto rounded-lg border border-gray-200">
          <DataTable
            columns={[
              {
                key: 'select',
                label: '',
                render: (_val: unknown, row: SkuMaster) => (
                  <button
                    onClick={() => handleSkuSelect(row)}
                    className="rounded text-indigo-600 hover:text-indigo-800"
                  >
                    選択
                  </button>
                ),
              },
              { key: 'groupName', label: '部門' },
              { key: 'className', label: '細分類' },
              { key: 'skuId', label: 'JAN' },
              { key: 'skuName', label: '商品名' },
            ]}
            data={skus}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-base text-gray-500">全 {skuTotal} 件</span>
          <Pagination
            currentPage={skuPage}
            perPage={PER_PAGE}
            totalItems={skuTotal}
            onPageChange={p => { setSkuPage(p); loadSkus(p, skuSearch) }}
          />
        </div>
      </Modal>

      {/* Store Selection Modal */}
      <Modal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        title="対象店舗の選択"
        size="lg"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="店舗名で検索"
            value={storeSearch}
            onChange={e => setStoreSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadStores(1, storeSearch)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-base focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="max-h-[60vh] min-h-[400px] overflow-y-auto rounded-lg border border-gray-200">
          <DataTable
            columns={[
              {
                key: 'select',
                label: '',
                render: (_val: unknown, row: StoreMaster) => (
                  <button
                    onClick={() => handleStoreSelect(row)}
                    className="rounded text-indigo-600 hover:text-indigo-800"
                  >
                    選択
                  </button>
                ),
              },
              { key: 'storeId', label: '店舗ID' },
              { key: 'storeName', label: '店舗名' },
            ]}
            data={stores}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-base text-gray-500">全 {storeTotal} 件</span>
          <Pagination
            currentPage={storePage}
            perPage={PER_PAGE}
            totalItems={storeTotal}
            onPageChange={p => { setStorePage(p); loadStores(p, storeSearch) }}
          />
        </div>
      </Modal>
    </div>
  )
}
