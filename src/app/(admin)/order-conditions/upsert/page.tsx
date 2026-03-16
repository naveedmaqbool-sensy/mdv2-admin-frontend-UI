'use client'

import { useState } from 'react'
import { Plus, X, Upload } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Datepicker from '@/components/Datepicker'
import Modal from '@/components/Modal'
import DataTable from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import {
  fetchSkuMasters,
  SkuMaster,
  upsertOrderConditions,
} from '@/lib/api/endpoints'
import { formatNumber } from '@/types/enums'

// Ported Enums
const SkuUnitTypes = [
  { value: 1, label: '単品' },
  { value: 2, label: 'CSV一括' },
]

const StoreUnitTypes = [
  { value: 1, label: '全店' },
  { value: 2, label: '店舗(グループ)別' },
]

const OrderingMethods = [
  { value: 1, label: '需要予測' },
  { value: 2, label: 'セルワンバイワン' },
  { value: 3, label: '発注点' },
]

const DeliveryDateTypes = [
  { value: 1, label: '全曜日可' },
  { value: 2, label: '日曜日のみ' },
  { value: 3, label: '月曜日のみ' },
  { value: 4, label: '火曜日のみ' },
  { value: 5, label: '水曜日のみ' },
  { value: 6, label: '木曜日のみ' },
  { value: 7, label: '金曜日のみ' },
  { value: 8, label: '土曜日のみ' },
]

const RoundUpDownTypes = [
  { value: 1, label: '切上げ' },
  { value: 2, label: '切下げ' },
]

interface TargetCondition {
  targetStoreCsvFile: File | null
  orderConditionStartDate: string
  orderConditionEndDate: string
  orderConditionPriority: number
  orderingMethod: number
  leadTimeDays: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
    saturday: number
    sunday: number
  }
  orderLot: number
  roundUpDownDefinition: number
  minimumOrderQty: number
  displayStockQty: number | ''
  displayLimitQty: number | ''
  cutDate: string
  deliveryType: number
}

function createDefaultTarget(): TargetCondition {
  return {
    targetStoreCsvFile: null,
    orderConditionStartDate: new Date().toISOString().split('T')[0],
    orderConditionEndDate: new Date().toISOString().split('T')[0],
    orderConditionPriority: 1,
    orderingMethod: 1,
    leadTimeDays: {
      monday: 1, tuesday: 1, wednesday: 1, thursday: 1, friday: 1, saturday: 1, sunday: 1
    },
    orderLot: 1,
    roundUpDownDefinition: 1, // Up
    minimumOrderQty: 1,
    displayStockQty: '',
    displayLimitQty: '',
    cutDate: '9999-12-31',
    deliveryType: 1, // All Days
  }
}

const PER_PAGE = 20

export default function OrderConditionsUpsertPage() {
  const [skuUnitType, setSkuUnitType] = useState(1) // 1: Single, 2: Multiple CSV
  const [storeUnitType, setStoreUnitType] = useState(1) // 1: All, 2: Group

  const [targetSkus, setTargetSkus] = useState<SkuMaster[]>([])
  const [targetSkuCsvFile, setTargetSkuCsvFile] = useState<File | null>(null)
  
  const [targets, setTargets] = useState<TargetCondition[]>([createDefaultTarget()])

  // Sku Modal State
  const [showSkuModal, setShowSkuModal] = useState(false)
  const [skus, setSkus] = useState<SkuMaster[]>([])
  const [skuTotal, setSkuTotal] = useState(0)
  const [skuPage, setSkuPage] = useState(1)
  const [skuSearch, setSkuSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function updateTarget<K extends keyof TargetCondition>(index: number, key: K, value: TargetCondition[K]) {
    const newTargets = [...targets]
    newTargets[index][key] = value

    // Auto update round definition if lot is 1
    if (key === 'orderLot' && value === 1) {
      newTargets[index].roundUpDownDefinition = 1
    }

    setTargets(newTargets)
  }

  function updateLeadTime(index: number, day: keyof TargetCondition['leadTimeDays'], value: number) {
    const newTargets = [...targets]
    newTargets[index].leadTimeDays[day] = value
    setTargets(newTargets)
  }

  async function handleSubmit() {
    setError(null)
    setSuccess(null)
    
    // Quick Validation
    if (skuUnitType === 1 && targetSkus.length === 0) {
      setError('対象SKUを指定してください。')
      return
    }
    if (skuUnitType === 2 && !targetSkuCsvFile) {
      setError('対象SKU CSVファイルを指定してください。')
      return
    }
    if (storeUnitType === 2) {
      for (const t of targets) {
        if (!t.targetStoreCsvFile) {
          setError('対象店舗 CSVファイルを指定してください。')
          return
        }
      }
    }

    setLoading(true)
    
    // Mock Payload Compilation
    const payload = {
      skuUnitType,
      storeUnitType,
      targetSkuIds: skuUnitType === 1 ? targetSkus.map(s => s.skuId) : [],
      targets: targets.map(t => ({
        orderConditionStartDate: t.orderConditionStartDate,
        orderConditionEndDate: t.orderConditionEndDate,
        orderConditionPriority: t.orderConditionPriority,
        orderingMethod: t.orderingMethod,
        leadTimeOnMonday: t.leadTimeDays.monday,
        leadTimeOnTuesday: t.leadTimeDays.tuesday,
        leadTimeOnWednesday: t.leadTimeDays.wednesday,
        leadTimeOnThursday: t.leadTimeDays.thursday,
        leadTimeOnFriday: t.leadTimeDays.friday,
        leadTimeOnSaturday: t.leadTimeDays.saturday,
        leadTimeOnSunday: t.leadTimeDays.sunday,
        orderLot: t.orderLot,
        roundUpDownDefinition: t.roundUpDownDefinition,
        minimumOrderQty: t.minimumOrderQty,
        cutDate: t.cutDate,
        deliveryType: t.deliveryType,
        displayStockQty: t.displayStockQty === '' ? null : t.displayStockQty,
        displayLimitQty: t.displayLimitQty === '' ? null : t.displayLimitQty,
      }))
    }

    try {
      await upsertOrderConditions(payload)
      setSuccess('更新・登録内容を受け付けました。')
      
      // Reset
      setTargets([createDefaultTarget()])
      setTargetSkus([])
      setTargetSkuCsvFile(null)
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました')
    } finally {
      setLoading(false)
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

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isSku: boolean, targetIndex?: number) {
    const file = e.target.files?.[0] || null
    if (isSku) {
      setTargetSkuCsvFile(file)
    } else if (targetIndex !== undefined) {
      updateTarget(targetIndex, 'targetStoreCsvFile', file)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl">
      <PageHeader title="発注条件マスタ 一括更新登録" />

      {error && <div className="rounded-lg bg-red-50 p-4 font-medium text-red-800 ring-1 ring-inset ring-red-200">{error}</div>}
      {success && <div className="rounded-lg bg-emerald-50 p-4 font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">{success}</div>}

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        
        {/* Base Settings */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-32 shrink-0"><label className="text-base text-gray-700">SKU設定単位</label></div>
            <select 
              value={skuUnitType} 
              onChange={e => {
                setSkuUnitType(Number(e.target.value))
                setTargetSkus([])
                setTargetSkuCsvFile(null)
              }}
              className="w-48 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {SkuUnitTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="w-32 shrink-0 pt-2"><label className="text-base text-gray-700">対象SKU</label></div>
            
            {skuUnitType === 1 ? (
              <div className="flex flex-1 items-center gap-4">
                <button
                  onClick={openSkuModal}
                  className="rounded-lg bg-indigo-50 px-4 py-2 text-base text-indigo-700 hover:bg-indigo-100"
                >選択</button>
                {targetSkus.length > 0 && (
                  <span className="text-base font-medium text-gray-900">{targetSkus[0].skuId} - {targetSkus[0].skuName}</span>
                )}
              </div>
            ) : (
              <div className="flex-1 max-w-sm">
                <label className="flex cursor-pointer appearance-none justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-6 transition hover:border-indigo-400">
                  <div className="flex flex-col items-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="mt-2 text-base text-gray-500">{targetSkuCsvFile ? targetSkuCsvFile.name : 'CSVファイルを選択'}</span>
                  </div>
                  <input type="file" accept=".csv" className="hidden" onChange={e => handleFileUpload(e, true)} />
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-32 shrink-0"><label className="text-base text-gray-700">設定単位</label></div>
            <select 
              value={storeUnitType} 
              onChange={e => {
                setStoreUnitType(Number(e.target.value))
                setTargets([createDefaultTarget()])
              }}
              className="w-48 rounded-lg border border-gray-200 px-3 py-2 text-base focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {StoreUnitTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        <div className="my-8 border-t border-gray-100" />

        {/* Dynamic Targets Form */}
        <div className="overflow-x-auto pb-4">
          <table className="w-full min-w-max text-left text-base">
            <thead>
              <tr>
                <th className="w-32 p-3 font-bold text-gray-700"></th>
                {targets.map((_, i) => (
                  <th key={i} className="min-w-[200px] p-3 font-semibold text-gray-900">
                    <div className="flex items-center justify-between">
                      グループ {i + 1}
                      {targets.length > 1 && (
                        <button onClick={() => setTargets(targets.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-1 rounded">
                          <X className="w-4 h-4"/>
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {storeUnitType === 2 && (
                <tr>
                  <td className="p-3 text-gray-700 align-top">店舗グループ</td>
                  {targets.map((t, i) => (
                    <td key={i} className="p-3 align-top">
                      <label className="flex cursor-pointer appearance-none justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-2 py-4 transition hover:border-indigo-400">
                        <div className="flex flex-col items-center">
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="mt-2 text-sm truncate max-w-[150px] text-gray-500">{t.targetStoreCsvFile ? t.targetStoreCsvFile.name : 'CSVファイル'}</span>
                        </div>
                        <input type="file" accept=".csv" className="hidden" onChange={e => handleFileUpload(e, false, i)} />
                      </label>
                    </td>
                  ))}
                </tr>
              )}

              <tr>
                <td className="p-3 text-gray-700">対象期間(from)</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><Datepicker value={t.orderConditionStartDate} onChange={v => updateTarget(i, 'orderConditionStartDate', v)} className="w-full" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">対象期間(to)</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><Datepicker value={t.orderConditionEndDate} onChange={v => updateTarget(i, 'orderConditionEndDate', v)} className="w-full" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">優先順位</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><input type="number" value={t.orderConditionPriority} onChange={e => updateTarget(i, 'orderConditionPriority', Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">発注方式</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3">
                    <select value={t.orderingMethod} onChange={e => updateTarget(i, 'orderingMethod', Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                      {OrderingMethods.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
              
              <tr><td colSpan={targets.length + 1} className="p-3 text-gray-900 bg-gray-50/50">リードタイム</td></tr>
              {[
                { k: 'monday', l: '【月曜日】' }, { k: 'tuesday', l: '【火曜日】' }, { k: 'wednesday', l: '【水曜日】' }, 
                { k: 'thursday', l: '【木曜日】' }, { k: 'friday', l: '【金曜日】' }, { k: 'saturday', l: '【土曜日】' }, { k: 'sunday', l: '【日曜日】' }
              ].map(day => (
                <tr key={day.k}>
                  <td className="p-3 text-right text-gray-600">{day.l}</td>
                  {targets.map((t, i) => (
                    <td key={i} className="p-3">
                      <input type="number" value={t.leadTimeDays[day.k as keyof TargetCondition['leadTimeDays']]} onChange={e => updateLeadTime(i, day.k as keyof TargetCondition['leadTimeDays'], Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </td>
                  ))}
                </tr>
              ))}

              <tr>
                <td className="p-3 text-gray-700">発注ロット</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><input type="number" value={t.orderLot} onChange={e => updateTarget(i, 'orderLot', Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">切上切下区分</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3">
                    <select value={t.roundUpDownDefinition} disabled={t.orderLot <= 1} onChange={e => updateTarget(i, 'roundUpDownDefinition', Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50">
                      {RoundUpDownTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">最低発注数量</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><input type="number" value={t.minimumOrderQty} onChange={e => updateTarget(i, 'minimumOrderQty', Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">見栄え在庫</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><input type="number" value={t.displayStockQty} onChange={e => updateTarget(i, 'displayStockQty', e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">陳列上限数</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><input type="number" value={t.displayLimitQty} onChange={e => updateTarget(i, 'displayLimitQty', e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-right focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">終売日</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3"><Datepicker value={t.cutDate} onChange={v => updateTarget(i, 'cutDate', v)} className="w-full" /></td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-gray-700">納品日判定区分</td>
                {targets.map((t, i) => (
                  <td key={i} className="p-3">
                    <select value={t.deliveryType} onChange={e => updateTarget(i, 'deliveryType', Number(e.target.value))} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                      {DeliveryDateTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>

          {targets.length < 5 && (
            <div className="mt-4 flex pl-[136px]">
              <button onClick={() => setTargets([...targets, createDefaultTarget()])} className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-base text-indigo-700 hover:bg-indigo-100">
                <Plus className="h-4 w-4" /> グループを追加
              </button>
            </div>
          )}

        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            onClick={() => {
              setTargets([createDefaultTarget()]); setTargetSkus([]); setTargetSkuCsvFile(null);
            }}
            className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-base text-gray-700 shadow-sm hover:bg-gray-50"
          >
            リセット
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-base text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            更新する
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
                  <button onClick={() => { setTargetSkus([row]); setShowSkuModal(false); }} className="rounded text-indigo-600 font-medium hover:text-indigo-800">
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
          <span className="text-base text-gray-500">全 {formatNumber(skuTotal)} 件</span>
          <Pagination
            currentPage={skuPage}
            perPage={PER_PAGE}
            totalItems={skuTotal}
            onPageChange={p => { setSkuPage(p); loadSkus(p, skuSearch) }}
          />
        </div>
      </Modal>

    </div>
  )
}
