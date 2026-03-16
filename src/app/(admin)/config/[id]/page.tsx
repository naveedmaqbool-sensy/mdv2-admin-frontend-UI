'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import SelectObjectModal from '@/components/monitoring/SelectObjectModal'
import { fetchThresholdConfig, updateThresholdConfig, ThresholdConfig } from '@/lib/api/endpoints'
import {
  fetchSkuMasters, fetchGroupMasters, fetchDepartmentMasters,
  fetchLineMasters, fetchClassMasters, fetchStoreMasters, fetchStoreGroups
} from '@/lib/api/endpoints'
import {
  MonitoringType, getMonitoringTypeName, getMonitoringTypeOptions,
  SkuMonitoringUnitType, getSkuMonitoringUnitTypeName, getSkuMonitoringUnitTypeOptions,
  StoreMonitoringUnitType, getStoreMonitoringUnitTypeName, getStoreMonitoringUnitTypeOptions,
} from '@/types/enums'

interface SelectedItem {
  [key: string]: string | number | undefined
}

export default function ConfigEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    monitoringType: MonitoringType.OrderQty as number,
    threshold: '',
    skuMonitoringUnitType: SkuMonitoringUnitType.Sku as number,
    storeMonitoringUnitType: StoreMonitoringUnitType.All as number,
    isAllTarget: true,
  })

  // Selected items
  const [selectedSkus, setSelectedSkus] = useState<SelectedItem[]>([])
  const [selectedGroups, setSelectedGroups] = useState<SelectedItem[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<SelectedItem[]>([])
  const [selectedLines, setSelectedLines] = useState<SelectedItem[]>([])
  const [selectedClasses, setSelectedClasses] = useState<SelectedItem[]>([])
  const [selectedStores, setSelectedStores] = useState<SelectedItem[]>([])
  const [selectedStoreGroups, setSelectedStoreGroups] = useState<SelectedItem[]>([])

  // Modals
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false)
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadData = useCallback(async () => {
    setLoading(true)
    const response = await fetchThresholdConfig(id)
    if (response) {
      setFormData({
        name: response.name || '',
        monitoringType: response.monitoringType,
        threshold: String(response.threshold ?? ''),
        skuMonitoringUnitType: response.skuMonitoringUnitType || SkuMonitoringUnitType.Sku,
        storeMonitoringUnitType: response.storeMonitoringUnitType || StoreMonitoringUnitType.All,
        isAllTarget: response.isActive,
      })
    }
    setLoading(false)
  }, [id])

  useEffect(() => { loadData() }, [loadData])

  function handleSkuUnitChange(val: number) {
    setFormData(prev => ({ ...prev, skuMonitoringUnitType: val }))
    setSelectedSkus([])
    setSelectedGroups([])
    setSelectedDepartments([])
    setSelectedLines([])
    setSelectedClasses([])
  }

  function openSkuModal() {
    setIsSkuModalOpen(true)
  }

  function openStoreModal() {
    setIsStoreModalOpen(true)
  }

  function getActiveSelectedItems(): SelectedItem[] {
    switch (formData.skuMonitoringUnitType) {
      case SkuMonitoringUnitType.Sku: return selectedSkus
      case SkuMonitoringUnitType.Group: return selectedGroups
      case SkuMonitoringUnitType.Department: return selectedDepartments
      case SkuMonitoringUnitType.Line: return selectedLines
      case SkuMonitoringUnitType.Class: return selectedClasses
      default: return []
    }
  }

  function getItemDisplayName(item: SelectedItem): string {
    return (item.skuName || item.groupName || item.departmentName || item.lineName || item.className || item.name || 'Unknown') as string
  }

  function removeItem(index: number) {
    const unitType = formData.skuMonitoringUnitType
    if (unitType === SkuMonitoringUnitType.Sku) setSelectedSkus(prev => prev.filter((_, i) => i !== index))
    else if (unitType === SkuMonitoringUnitType.Group) setSelectedGroups(prev => prev.filter((_, i) => i !== index))
    else if (unitType === SkuMonitoringUnitType.Department) setSelectedDepartments(prev => prev.filter((_, i) => i !== index))
    else if (unitType === SkuMonitoringUnitType.Line) setSelectedLines(prev => prev.filter((_, i) => i !== index))
    else if (unitType === SkuMonitoringUnitType.Class) setSelectedClasses(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    setErrors({})
    const data: Partial<ThresholdConfig> = {
      name: formData.name,
      monitoringType: formData.monitoringType,
      threshold: Number(formData.threshold),
      skuMonitoringUnitType: formData.skuMonitoringUnitType,
      storeMonitoringUnitType: formData.storeMonitoringUnitType,
      isActive: formData.isAllTarget,
    }
    const response = await updateThresholdConfig(id, data)
    setSaving(false)
    if (response) {
      router.push('/config')
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
      </div>
    )
  }

  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
  const selectClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 shadow-sm transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
  const labelClass = "text-[15px] font-bold text-gray-700"

  return (
    <div className="space-y-8 pb-12">
      <PageHeader title="閾値編集" subtitle="アラート閾値の設定を編集します" />

      <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
        <div className="p-8 space-y-6">
          {/* Alert Name */}
          <div className="grid gap-4 sm:grid-cols-[160px_1fr] items-center">
            <label className={labelClass}>アラート名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`${inputClass} max-w-lg`}
            />
            {errors.name && <div className="sm:col-start-2 text-sm text-red-500">{errors.name}</div>}
          </div>

          {/* Alert Type + Threshold */}
          <div className="grid gap-4 sm:grid-cols-[160px_1fr] items-center">
            <label className={labelClass}>アラート種類</label>
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={formData.monitoringType}
                onChange={e => setFormData(prev => ({ ...prev, monitoringType: Number(e.target.value) }))}
                className={`${selectClass} max-w-xs`}
              >
                {getMonitoringTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <label className={labelClass}>閾値</label>
              <input
                type="number"
                value={formData.threshold}
                onChange={e => setFormData(prev => ({ ...prev, threshold: e.target.value }))}
                className={`${inputClass} w-32`}
              />
            </div>
          </div>

          {/* Target Unit */}
          <div className="grid gap-4 sm:grid-cols-[160px_1fr] items-center">
            <label className={labelClass}>対象単位</label>
            <div className="flex items-center gap-4">
              <select
                value={formData.skuMonitoringUnitType}
                onChange={e => handleSkuUnitChange(Number(e.target.value))}
                className={`${selectClass} max-w-xs`}
              >
                {getSkuMonitoringUnitTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={openSkuModal}
                className="rounded-xl bg-gray-900 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95"
              >
                選択
              </button>
            </div>
          </div>

          {/* Selected Items */}
          {getActiveSelectedItems().length > 0 && (
            <div className="sm:ml-[176px] flex flex-wrap gap-2">
              {getActiveSelectedItems().map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                  {getItemDisplayName(item)}
                  <button onClick={() => removeItem(idx)} className="ml-1 text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
          )}

          {/* Target Store */}
          <div className="grid gap-4 sm:grid-cols-[160px_1fr] items-center">
            <label className={labelClass}>対象店舗</label>
            <div className="flex items-center gap-4">
              <select
                value={formData.storeMonitoringUnitType}
                onChange={e => setFormData(prev => ({ ...prev, storeMonitoringUnitType: Number(e.target.value) }))}
                className={`${selectClass} max-w-xs`}
              >
                {getStoreMonitoringUnitTypeOptions().map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={openStoreModal}
                disabled={formData.storeMonitoringUnitType === StoreMonitoringUnitType.All}
                className="rounded-xl bg-gray-900 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-40"
              >
                選択
              </button>
            </div>
          </div>

          {/* Selected Stores */}
          {(selectedStores.length > 0 || selectedStoreGroups.length > 0) && (
            <div className="sm:ml-[176px] flex flex-wrap gap-2">
              {selectedStores.map((item, idx) => (
                <span key={`s-${idx}`} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                  {(item.storeName || 'Unknown') as string}
                  <button onClick={() => setSelectedStores(prev => prev.filter((_, i) => i !== idx))} className="ml-1 text-gray-400 hover:text-red-500">&times;</button>
                </span>
              ))}
              {selectedStoreGroups.map((item, idx) => (
                <span key={`sg-${idx}`} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-700">
                  {(item.storeGroupName || 'Unknown') as string}
                  <button onClick={() => setSelectedStoreGroups(prev => prev.filter((_, i) => i !== idx))} className="ml-1 text-blue-400 hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-5">
          <button
            onClick={() => router.push('/config')}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-base text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            キャンセル
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

      {/* SKU Selection Modal */}
      <SelectObjectModal
        isOpen={isSkuModalOpen}
        onClose={() => setIsSkuModalOpen(false)}
        onSave={(items) => {
          const unit = formData.skuMonitoringUnitType
          if (unit === SkuMonitoringUnitType.Sku) setSelectedSkus(items)
          else if (unit === SkuMonitoringUnitType.Group) setSelectedGroups(items)
          else if (unit === SkuMonitoringUnitType.Department) setSelectedDepartments(items)
          else if (unit === SkuMonitoringUnitType.Line) setSelectedLines(items)
          else if (unit === SkuMonitoringUnitType.Class) setSelectedClasses(items)
          setIsSkuModalOpen(false)
        }}
        title={`${getSkuMonitoringUnitTypeName(formData.skuMonitoringUnitType as SkuMonitoringUnitType)}を選択`}
        idKey={formData.skuMonitoringUnitType === SkuMonitoringUnitType.Sku ? 'skuId' : formData.skuMonitoringUnitType === SkuMonitoringUnitType.Group ? 'groupId' : 'id'}
        initialSelected={getActiveSelectedItems()}
        columns={[
          { key: formData.skuMonitoringUnitType === SkuMonitoringUnitType.Sku ? 'skuId' : 'id', label: 'ID' },
          { key: formData.skuMonitoringUnitType === SkuMonitoringUnitType.Sku ? 'skuName' : 'name', label: '名称' },
        ]}
        fetchItems={async (p) => {
          if (formData.skuMonitoringUnitType === SkuMonitoringUnitType.Sku) return fetchSkuMasters(p)
          if (formData.skuMonitoringUnitType === SkuMonitoringUnitType.Group) return fetchGroupMasters(p)
          if (formData.skuMonitoringUnitType === SkuMonitoringUnitType.Department) return fetchDepartmentMasters(p)
          if (formData.skuMonitoringUnitType === SkuMonitoringUnitType.Line) return fetchLineMasters(p)
          if (formData.skuMonitoringUnitType === SkuMonitoringUnitType.Class) return fetchClassMasters(p)
          return null
        }}
      />

      {/* Store Selection Modal */}
      <SelectObjectModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        onSave={(items) => {
          if (formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store) setSelectedStores(items)
          else if (formData.storeMonitoringUnitType === StoreMonitoringUnitType.Area) setSelectedStoreGroups(items)
          setIsStoreModalOpen(false)
        }}
        title={formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store ? '店舗を選択' : '店舗グループを選択'}
        idKey={formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store ? 'storeId' : 'storeGroupId'}
        initialSelected={formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store ? selectedStores : selectedStoreGroups}
        columns={[
          { key: formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store ? 'storeId' : 'storeGroupId', label: 'ID' },
          { key: formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store ? 'storeName' : 'storeGroupName', label: '名称' },
        ]}
        fetchItems={formData.storeMonitoringUnitType === StoreMonitoringUnitType.Store ? fetchStoreMasters : fetchStoreGroups}
      />
    </div>
  )
}
