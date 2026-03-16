'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Datepicker from '@/components/Datepicker'
import { fetchOrderCondition, updateOrderCondition, OrderCondition } from '@/lib/api/endpoints'
import {
  getOrderingMethodTypeName, getOrderingMethodTypeOptions,
  getRoundUpDownTypeName, getRoundUpDownTypeOptions,
  getDeliveryDateTypeName, getDeliveryDateTypeOptions,
} from '@/types/enums'

export default function OrderConditionEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [condition, setCondition] = useState<OrderCondition | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const response = await fetchOrderCondition(id)
    if (response) {
      setCondition(response)
    }
    setLoading(false)
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  function updateField<K extends keyof OrderCondition>(key: K, value: OrderCondition[K]) {
    setCondition(prev => prev ? { ...prev, [key]: value } : prev)
  }

  async function handleSave() {
    if (!condition) return
    setSaving(true)
    const response = await updateOrderCondition(condition.skuId, condition)
    setSaving(false)
    if (response) {
      router.push('/order-conditions')
    }
  }

  if (loading || !condition) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
      </div>
    )
  }

  const inputClass = "rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
  const selectClass = "rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
  const labelClass = "text-sm font-bold text-gray-600 whitespace-nowrap"
  const valueClass = "text-base text-gray-800"

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="発注条件マスタ 編集" subtitle="商品別の発注条件を編集します" />

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
        <div className="p-8 space-y-8">
          {/* Read-only Header Info */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
            <div>
              <p className={labelClass}>店舗</p>
              <p className={valueClass}>{condition.storeMaster?.storeName || condition.storeName}</p>
            </div>
            <div>
              <p className={labelClass}>JAN</p>
              <p className={valueClass}>{condition.storeSkuMaster?.janCode || condition.skuId}</p>
            </div>
            <div>
              <p className={labelClass}>部門</p>
              <p className={valueClass}>{condition.storeSkuMaster?.groupMaster?.groupName || '—'}</p>
            </div>
            <div>
              <p className={labelClass}>中分類</p>
              <p className={valueClass}>{condition.storeSkuMaster?.departmentMaster?.departmentName || '—'}</p>
            </div>
            <div>
              <p className={labelClass}>小分類</p>
              <p className={valueClass}>{condition.storeSkuMaster?.lineMaster?.lineName || '—'}</p>
            </div>
            <div>
              <p className={labelClass}>細分類</p>
              <p className={valueClass}>{condition.storeSkuMaster?.classMaster?.className || '—'}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className={labelClass}>商品名</p>
              <p className={valueClass}>{condition.storeSkuMaster?.skuName || condition.skuName}</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Editable: Period + Priority */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className={labelClass}>対象期間（開始）<span className="text-red-500 ml-1">*</span></label>
              <Datepicker
                value={condition.orderConditionStartDate || ''}
                onChange={(val) => updateField('orderConditionStartDate', val)}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>対象期間（終了）<span className="text-red-500 ml-1">*</span></label>
              <Datepicker
                value={condition.orderConditionEndDate || ''}
                onChange={(val) => updateField('orderConditionEndDate', val)}
              />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>優先度 <span className="text-red-500 ml-1">*</span></label>
              <input
                type="number"
                value={condition.orderConditionPriority ?? ''}
                onChange={e => updateField('orderConditionPriority', Number(e.target.value))}
                className={`${inputClass} w-full`}
              />
            </div>
          </div>

          {/* Ordering Method + Lead Times */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-800">発注方式 ＆ リードタイム</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              <div className="space-y-2 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                <label className={labelClass}>発注方式</label>
                <select
                  value={condition.orderingMethod}
                  onChange={e => updateField('orderingMethod', Number(e.target.value))}
                  className={`${selectClass} w-full`}
                >
                  {getOrderingMethodTypeOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              {[
                { key: 'leadTimeOnMonday' as const, label: '月曜LT' },
                { key: 'leadTimeOnTuesday' as const, label: '火曜LT' },
                { key: 'leadTimeOnWednesday' as const, label: '水曜LT' },
                { key: 'leadTimeOnThursday' as const, label: '木曜LT' },
                { key: 'leadTimeOnFriday' as const, label: '金曜LT' },
                { key: 'leadTimeOnSaturday' as const, label: '土曜LT' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className={labelClass}>{label}</label>
                  <input
                    type="number"
                    value={condition[key] ?? ''}
                    onChange={e => updateField(key, e.target.value ? Number(e.target.value) : null)}
                    className={`${inputClass} w-full`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-4 lg:grid-cols-8">
              <div className="space-y-2">
                <label className={labelClass}>日曜LT</label>
                <input
                  type="number"
                  value={condition.leadTimeOnSunday ?? ''}
                  onChange={e => updateField('leadTimeOnSunday', e.target.value ? Number(e.target.value) : null)}
                  className={`${inputClass} w-full`}
                />
              </div>
            </div>
          </div>

          {/* Order Lot, Rounding, Min Order, Display Stock, Display Limit */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-800">発注条件</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <label className={labelClass}>発注ロット</label>
                <input
                  type="number"
                  value={condition.orderLot ?? ''}
                  onChange={e => updateField('orderLot', e.target.value ? Number(e.target.value) : null)}
                  className={`${inputClass} w-full`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>切上切下区分</label>
                <select
                  value={condition.roundUpDownDefinition}
                  onChange={e => updateField('roundUpDownDefinition', Number(e.target.value))}
                  className={`${selectClass} w-full`}
                >
                  {getRoundUpDownTypeOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>最低発注数</label>
                <input
                  type="number"
                  value={condition.minimumOrderQty ?? ''}
                  onChange={e => updateField('minimumOrderQty', e.target.value ? Number(e.target.value) : null)}
                  className={`${inputClass} w-full`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>見栄え在庫数</label>
                <input
                  type="number"
                  value={condition.displayStockQty ?? ''}
                  onChange={e => updateField('displayStockQty', e.target.value ? Number(e.target.value) : null)}
                  className={`${inputClass} w-full`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>陳列上限数</label>
                <input
                  type="number"
                  value={condition.displayLimitQty ?? ''}
                  onChange={e => updateField('displayLimitQty', e.target.value ? Number(e.target.value) : null)}
                  className={`${inputClass} w-full`}
                />
              </div>
            </div>
          </div>

          {/* Cut Date + Delivery Type */}
          <div>
            <h3 className="mb-4 text-base font-bold text-gray-800">終売・納品</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className={labelClass}>終売日</label>
                <Datepicker
                  value={condition.cutDate || ''}
                  onChange={(val) => updateField('cutDate', val || null)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className={labelClass}>納品日判定区分</label>
                <select
                  value={condition.deliveryType}
                  onChange={e => updateField('deliveryType', Number(e.target.value))}
                  className={`${selectClass} w-full max-w-lg`}
                >
                  {getDeliveryDateTypeOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
          <button
            onClick={() => router.push('/order-conditions')}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-base text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
