<template>
  <div>
    <CommonHeader title="モニタリング" />

    <!-- 検索条件 -->
    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-6' },
      }"
    >
      <UForm :state="{}" @submit="fetch(1)">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Metric side -->
          <div
            class="border-b border-gray-100 pb-6 lg:w-1/4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8"
          >
            <h3
              class="mb-4 border-b border-gray-100 pb-2 font-bold text-gray-800"
            >
              集計指標
            </h3>
            <UFormGroup>
              <CommonSelect
                v-model:selected="formData.monitoringType"
                :options="MonitoringTypes.getMonitoringNameValues()"
                class="w-full"
              />
            </UFormGroup>
          </div>

          <!-- Filters side -->
          <div class="space-y-6 lg:w-3/4">
            <div
              class="hidden grid-cols-12 gap-4 border-b border-gray-50 pb-2 text-xs font-bold text-gray-400 md:grid"
            >
              <div class="col-span-2"></div>
              <div class="col-span-3 text-center tracking-widest">
                【取得単位】
              </div>
              <div class="col-span-3 text-center tracking-widest">
                【取得範囲】
              </div>
              <div class="col-span-4"></div>
            </div>

            <!-- Product -->
            <UFormGroup>
              <div class="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
                <label class="font-bold text-gray-700 md:col-span-2"
                  >対象商品</label
                >
                <CommonSelect
                  v-model:selected="formData.skuMonitoringUnitType"
                  class="md:col-span-3"
                  :options="SkuMonitoringUnitTypes.getNameValues()"
                  @change="onChangedSkuMonitoringUnitType"
                />
                <CommonSelect
                  v-model:selected="formData.skuMonitoringRangeType"
                  class="md:col-span-3"
                  :options="
                    skuRangeTypes.map((v) => ({
                      name: SkuMonitoringUnitTypes.getName(v),
                      value: v,
                    }))
                  "
                  placeholder="-"
                  @change="onChangedSkuMonitoringRangeType"
                />
                <div class="md:col-span-4">
                  <UButton
                    color="gray"
                    variant="solid"
                    :disabled="formData.skuMonitoringRangeType === null"
                    @click="openSkuModal"
                    icon="i-heroicons-cursor-arrow-rays"
                    >範囲指定</UButton
                  >
                </div>
              </div>
            </UFormGroup>

            <!-- validation error -->
            <div
              v-if="apiValidationError?.exists('skuMonitoringRangeType')"
              class="-mt-4 text-sm text-red-500"
            >
              {{ apiValidationError.first('skuMonitoringRangeType') }}
            </div>
            <div
              v-else-if="apiValidationError?.exists('skuMonitoringUnitType')"
              class="-mt-4 text-sm text-red-500"
            >
              {{ apiValidationError.first('skuMonitoringUnitType') }}
            </div>

            <!-- selected badges -->
            <div
              v-if="formData.skus.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(sku, index) in formData.skus"
                :key="sku.skuId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ sku.skuName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.skus.splice(index, 1)"
                />
              </UBadge>
            </div>
            <div
              v-if="formData.groups.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(group, index) in formData.groups"
                :key="group.groupId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ group.groupName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.groups.splice(index, 1)"
                />
              </UBadge>
            </div>
            <div
              v-if="formData.departments.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(department, index) in formData.departments"
                :key="department.departmentId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ department.departmentName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.departments.splice(index, 1)"
                />
              </UBadge>
            </div>
            <div
              v-if="formData.classes.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(clazz, index) in formData.classes"
                :key="clazz.classId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ clazz.className }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.classes.splice(index, 1)"
                />
              </UBadge>
            </div>
            <div
              v-if="formData.lines.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(line, index) in formData.lines"
                :key="line.lineId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ line.lineName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.lines.splice(index, 1)"
                />
              </UBadge>
            </div>

            <!-- Store -->
            <UFormGroup>
              <div class="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
                <label class="font-bold text-gray-700 md:col-span-2"
                  >対象店舗</label
                >
                <CommonSelect
                  v-model:selected="formData.storeMonitoringUnitType"
                  class="md:col-span-3"
                  :options="StoreMonitoringUnitTypes.getNameValues()"
                  @change="onChangedStoreMonitoringUnitType"
                />
                <CommonSelect
                  v-model:selected="formData.storeMonitoringRangeType"
                  class="md:col-span-3"
                  :options="
                    storeRangeTypes.map((v) => ({
                      name: StoreMonitoringUnitTypes.getName(v),
                      value: v,
                    }))
                  "
                  placeholder="-"
                  :disabled="
                    formData.storeMonitoringUnitType ===
                    StoreMonitoringUnitTypes.All
                  "
                  @change="onChangedStoreMonitoringRangeType"
                />
                <div class="md:col-span-4">
                  <UButton
                    color="gray"
                    variant="solid"
                    :disabled="formData.storeMonitoringRangeType === null"
                    @click="openStoreModal"
                    icon="i-heroicons-cursor-arrow-rays"
                    >範囲指定</UButton
                  >
                </div>
              </div>
            </UFormGroup>

            <!-- validation error -->
            <div
              v-if="apiValidationError?.exists('storeMonitoringRangeType')"
              class="-mt-4 text-sm text-red-500"
            >
              {{ apiValidationError.first('storeMonitoringRangeType') }}
            </div>
            <div
              v-else-if="apiValidationError?.exists('storeMonitoringUnitType')"
              class="-mt-4 text-sm text-red-500"
            >
              {{ apiValidationError.first('storeMonitoringUnitType') }}
            </div>

            <!-- selected badges -->
            <div
              v-if="formData.stores.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(store, index) in formData.stores"
                :key="store.storeId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ store.storeName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.stores.splice(index, 1)"
                />
              </UBadge>
            </div>
            <div
              v-if="formData.storeGroups.length > 0"
              class="-mt-3 flex flex-wrap gap-2"
            >
              <UBadge
                v-for="(storeGroup, index) in formData.storeGroups"
                :key="storeGroup.storeGroupId"
                color="gray"
                variant="subtle"
                class="py-1 pl-2 pr-1"
              >
                {{ storeGroup.storeGroupName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  class="ml-1"
                  @click="formData.storeGroups.splice(index, 1)"
                />
              </UBadge>
            </div>

            <!-- Period -->
            <UFormGroup>
              <div class="grid grid-cols-1 items-center gap-3 md:grid-cols-12">
                <label class="font-bold text-gray-700 md:col-span-2"
                  >対象期間</label
                >
                <CommonSelect
                  v-model:selected="formData.monitoringHorizontalAxisType"
                  class="md:col-span-3"
                  :options="MonitoringHorizontalAxisTypes.getNameValues()"
                />
                <div
                  class="flex flex-col items-center gap-2 sm:flex-row md:col-span-7"
                >
                  <div class="w-full sm:w-40">
                    <CommonDatepicker v-model="formData.targetDateFrom" />
                  </div>
                  <span class="text-gray-400">～</span>
                  <div class="w-full sm:w-40">
                    <CommonDatepicker v-model="formData.targetDateTo" />
                  </div>
                </div>
              </div>
            </UFormGroup>

            <div
              v-if="apiValidationError?.exists('targetDateFrom')"
              class="-mt-4 text-sm text-red-500"
            >
              {{ apiValidationError.first('targetDateFrom') }}
            </div>
            <div
              v-if="apiValidationError?.exists('targetDateTo')"
              class="-mt-4 text-sm text-red-500"
            >
              {{ apiValidationError.first('targetDateTo') }}
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div
          class="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-5 md:flex-row"
        >
          <div class="flex items-center gap-3">
            <UButton
              color="gray"
              variant="ghost"
              @click="reset"
              icon="i-heroicons-arrow-path"
              >条件リセット</UButton
            >
            <UButton
              color="indigo"
              size="md"
              @click="fetch(1)"
              icon="i-heroicons-presentation-chart-bar"
              >集計を実行</UButton
            >
            <UButton
              v-if="canShowEffectiveness"
              color="blue"
              variant="soft"
              size="md"
              :disabled="selectedRows.length === 0"
              @click="openEffectiveness"
              icon="i-heroicons-presentation-chart-line"
              >効果測定へ遷移</UButton
            >
          </div>
          <div>
            <UButton
              color="white"
              variant="solid"
              :disabled="kpiRows.length === 0 || kpiHeaders.length === 0"
              @click="csvExport"
              icon="i-heroicons-arrow-down-tray"
              >CSV出力</UButton
            >
          </div>
        </div>
      </UForm>
    </UCard>

    <!-- 集計結果 -->
    <UCard
      v-if="kpiRows.length > 0 && kpiHeaders.length > 0"
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-0 sm:p-0' },
      }"
    >
      <UTable
        v-if="canShowEffectiveness"
        v-model="selectedRows"
        class="fixed-name"
        :columns="[
          ...kpiHeaders.map((v, index) => ({
            key: index.toString(),
            label: v,
          })),
        ]"
        :rows="
          kpiRows.map((values) => {
            const result: { [key: string]: string } = {}
            Object.keys(values).forEach((key) => {
              result[key] = values[key]
            })
            return result
          })
        "
        @select="onSelectRow"
      />
      <UTable
        v-else
        class="fixed-name"
        :columns="[
          ...kpiHeaders.map((v, index) => ({
            key: index.toString(),
            label: v,
          })),
        ]"
        :rows="
          kpiRows.map((values) => {
            const result: { [key: string]: string } = {}
            Object.keys(values).forEach((key) => {
              result[key] = values[key]
            })
            return result
          })
        "
        @select="onSelectRow"
      />

      <div
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500"
          >全 {{ formatterNumber(kpiItemTotal) }} 件のご確認</span
        >
        <UPagination
          v-model="paginationPage"
          :page-count="formData.perPage"
          :max="5"
          :total="kpiItemTotal"
        />
      </div>
    </UCard>

    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenSkuModal"
      v-model:selected="formData.skus"
      v-model:items="skus"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
        { key: 'className', label: '細分類' },
        { key: 'skuId', label: 'JAN' },
        { key: 'skuName', label: '商品名' },
      ]"
      id-column-name="skuId"
      initial-state-is-empty
      @fetch-items="fetchSkus"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenGroupsModal"
      v-model:selected="formData.groups"
      v-model:items="groups"
      v-model:total="itemsTotal"
      :columns="[{ key: 'groupName', label: '部門' }]"
      id-column-name="groupId"
      @fetch-items="fetchGroups"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenDepartmentsModal"
      v-model:selected="formData.departments"
      v-model:items="departments"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
      ]"
      id-column-name="departmentId"
      @fetch-items="fetchDepartments"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenLinesModal"
      v-model:selected="formData.lines"
      v-model:items="lines"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
      ]"
      id-column-name="lineId"
      @fetch-items="fetchLines"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenClassesModal"
      v-model:selected="formData.classes"
      v-model:items="classes"
      v-model:total="itemsTotal"
      :columns="[
        { key: 'groupName', label: '部門' },
        { key: 'departmentName', label: '中分類' },
        { key: 'lineName', label: '小分類' },
        { key: 'className', label: '細分類' },
      ]"
      id-column-name="classId"
      @fetch-items="fetchClasses"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenStoreMasterModal"
      v-model:selected="formData.stores"
      v-model:items="storeMasters"
      v-model:total="itemsTotal"
      :columns="[{ key: 'storeName', label: '店舗' }]"
      id-column-name="storeId"
      @fetch-items="fetchStores"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenStoreGroupModal"
      v-model:selected="formData.storeGroups"
      v-model:items="storeGroups"
      v-model:total="itemsTotal"
      :columns="[{ key: 'storeGroupName', label: '店舗グループ' }]"
      id-column-name="storeGroupId"
      @fetch-items="fetchStoreGroups"
    />
    <MonitoringDetailModal
      v-if="!!monitoringDetailRequest"
      v-model:is-open-modal="isOpenModal"
      v-model:page="monitoringDetailRequest.page"
      v-model:perPage="monitoringDetailRequest.perPage"
      v-model:search-text="monitoringDetailRequest.searchText"
      :items="monitoringDetails"
      :total="monitoringDetailTotal"
      :monitoring-type="monitoringDetailRequest.monitoringType!"
      @fetch-items="fetchMonitoringDetail"
      @csv-export="csvExportMonitoringDetail"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApiMonitoringDetailRequest } from '~/composables/api/monitoring/Detail'
import ApiValidationError from '~/types/classes/ApiValidationError'
import MonitoringHorizontalAxisTypes from '~/types/enums/MonitoringHorizontalAxisTypes'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import PaginationRequestFactory from '~/types/interfaces/common/PaginationRequestFactory'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type StoreGroup from '~/types/interfaces/database/SensyCloud/StoreGroup'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'
import type MonitoringFormData from '~/types/interfaces/page/monitoring/FormData'
import FormDataFactory from '~/types/interfaces/page/monitoring/FormDataFactory'

// 初期表示の検索条件は最後に検索した設定を参照する
const cacheFormData = frontCacheGet('monitoringFormData', true)
const formData = ref<MonitoringFormData>(new FormDataFactory())
if (cacheFormData !== null) {
  formData.value = {
    ...cacheFormData,
    targetDateFrom: cacheFormData.targetDateFrom
      ? new Date(cacheFormData.targetDateFrom)
      : null,
    targetDateTo: cacheFormData.targetDateTo
      ? new Date(cacheFormData.targetDateTo)
      : null,
  }
}

const isOpenSkuModal = ref(false)
const skus = ref<any[]>([]) // FIXME: rfukuma 型定義作ったら充てる
const isOpenGroupsModal = ref(false)
const groups = ref<GroupMaster[]>([])
const isOpenDepartmentsModal = ref(false)
const departments = ref<DepartmentMaster[]>([])
const isOpenLinesModal = ref(false)
const lines = ref<LineMaster[]>([])
const isOpenClassesModal = ref(false)
const classes = ref<ClassMaster[]>([])
const isOpenStoreMasterModal = ref(false)
const storeMasters = ref<StoreMaster[]>([])
const isOpenStoreGroupModal = ref(false)
const storeGroups = ref<StoreGroup[]>([])
const itemsTotal = ref(0)

const kpiRows = ref<{ [key: string]: string }[]>([])
const kpiHeaders = ref<string[]>([])
const kpiItemTotal = ref(0)
const apiValidationError = ref<ApiValidationError | null>(null)

const selectedRows = ref<any[]>([])

const skuRangeTypes = computed(() => {
  switch (formData.value.skuMonitoringUnitType) {
    case SkuMonitoringUnitTypes.Sku:
      return [
        SkuMonitoringUnitTypes.Sku,
        SkuMonitoringUnitTypes.Group,
        SkuMonitoringUnitTypes.Department,
        SkuMonitoringUnitTypes.Line,
        SkuMonitoringUnitTypes.Class,
      ]
    case SkuMonitoringUnitTypes.Group:
      return [SkuMonitoringUnitTypes.Group]
    case SkuMonitoringUnitTypes.Department:
      return [SkuMonitoringUnitTypes.Group, SkuMonitoringUnitTypes.Department]
    case SkuMonitoringUnitTypes.Line:
      return [
        SkuMonitoringUnitTypes.Group,
        SkuMonitoringUnitTypes.Department,
        SkuMonitoringUnitTypes.Line,
      ]
    case SkuMonitoringUnitTypes.Class:
      return [
        SkuMonitoringUnitTypes.Group,
        SkuMonitoringUnitTypes.Department,
        SkuMonitoringUnitTypes.Line,
        SkuMonitoringUnitTypes.Class,
      ]
  }
  return []
})

const storeRangeTypes = computed(() => {
  switch (formData.value.storeMonitoringUnitType) {
    case StoreMonitoringUnitTypes.Store:
      // 店舗グループ排除
      // return [StoreMonitoringUnitTypes.Store, StoreMonitoringUnitTypes.Area]
      return [StoreMonitoringUnitTypes.Store]
    case StoreMonitoringUnitTypes.Area:
      return [StoreMonitoringUnitTypes.Area]
  }
  return []
})

const paginationPage = computed({
  get: () => formData.value.page,
  set: (page: number) => {
    fetch(page)
  },
})

const isOpenModal = ref(false)
const monitoringDetailRequest = ref<ApiMonitoringDetailRequest>()
const monitoringDetails = ref<any[]>([])
const monitoringDetailTotal = ref(0)

const canShowEffectiveness = ref(false)

function reset() {
  formData.value = new FormDataFactory()
}

async function fetch(page: number) {
  formData.value.page = page

  // 検索したら選択行を削除
  // これするとページングで引き継げないのでそれでいいかどうか
  selectedRows.value = []

  serviceLoadingStart()

  const response = await apiMonitoringFetch(formData.value)

  serviceLoadingFinish()

  apiValidationError.value = new ApiValidationError()
  if (!response || apiValidationError.value!.exists()) {
    return
  }

  kpiRows.value = response.rows
  kpiHeaders.value = response.headers
  kpiItemTotal.value = response.total

  // 最後に検索した設定を保持
  frontCacheSet('monitoringFormData', formData.value, true)

  // 効果測定への画面遷移の制御
  // 店別の場合以外は画面遷移を非表示
  canShowEffectiveness.value =
    formData.value.storeMonitoringUnitType === StoreMonitoringUnitTypes.Store
}

async function csvExport() {
  serviceLoadingStart()
  const response = await apiMonitoringCsvExport(formData.value)
  serviceLoadingFinish()
  if (!response) {
    useNuxtApp().$toast.error('予期せぬエラーが発生しました。')
  }
}

async function fetchSkus(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiSkuMasterFetch(searchRequest)
  skus.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchGroups(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiGroupMasterFetch(searchRequest)
  groups.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchDepartments(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiDepartmentMasterFetch(searchRequest)
  departments.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchLines(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiLineMasterFetch(searchRequest)
  lines.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchClasses(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiClassMasterFetch(searchRequest)
  classes.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchStores(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiStoreMasterFetch(searchRequest)
  storeMasters.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

async function fetchStoreGroups(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  // HACK: rfukuma 店舗グループの扱いが変わる可能性があるため StoreMaster 参照とする
  const response = await apiStoreGroupFetch(searchRequest)
  storeGroups.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

function openSkuModal() {
  switch (formData.value.skuMonitoringRangeType) {
    case SkuMonitoringUnitTypes.Sku:
      isOpenSkuModal.value = true
      break
    case SkuMonitoringUnitTypes.Group:
      isOpenGroupsModal.value = true
      break
    case SkuMonitoringUnitTypes.Department:
      isOpenDepartmentsModal.value = true
      break
    case SkuMonitoringUnitTypes.Line:
      isOpenLinesModal.value = true
      break
    case SkuMonitoringUnitTypes.Class:
      isOpenClassesModal.value = true
      break
  }
}

function openStoreModal() {
  switch (formData.value.storeMonitoringRangeType) {
    case StoreMonitoringUnitTypes.All:
    case StoreMonitoringUnitTypes.Store:
      isOpenStoreMasterModal.value = true
      break
    case StoreMonitoringUnitTypes.Area:
      isOpenStoreGroupModal.value = true
      break
  }
}

function onChangedSkuMonitoringUnitType() {
  // 指定できない場合は初期化する
  if (
    formData.value.skuMonitoringRangeType &&
    !skuRangeTypes.value.includes(formData.value.skuMonitoringRangeType)
  ) {
    formData.value.skuMonitoringRangeType = null
    formData.value.skus = []
    formData.value.groups = []
    formData.value.departments = []
    formData.value.classes = []
    formData.value.lines = []
  }
}

function onChangedSkuMonitoringRangeType() {
  formData.value.skus = []
  formData.value.groups = []
  formData.value.departments = []
  formData.value.classes = []
  formData.value.lines = []
}

function onChangedStoreMonitoringUnitType() {
  if (
    formData.value.storeMonitoringRangeType &&
    !storeRangeTypes.value.includes(formData.value.storeMonitoringRangeType)
  ) {
    formData.value.storeMonitoringRangeType = null
    formData.value.storeGroups = []
    formData.value.stores = []
  }
}

function onChangedStoreMonitoringRangeType() {
  formData.value.storeGroups = []
  formData.value.stores = []
}

async function onSelectRow(row: { [key: string]: string }) {
  const fetchRequest = frontCacheGet('monitoringFormData', true)

  monitoringDetailRequest.value = {
    targetId: row.targetId,
    searchText: '',
    ...fetchRequest,
    ...new PaginationRequestFactory(),
  }

  // 発注修正数と発注修正率以外の場合は処理しない
  if (
    ![MonitoringTypes.OrderChangePty, MonitoringTypes.OrderChangeRate].includes(
      monitoringDetailRequest.value!.monitoringType!
    )
  ) {
    useNuxtApp().$toast.info(
      '明細情報は\n・発注修正数\n・発注修正率\nのみ対応しています。'
    )
    return
  }

  const result = await fetchMonitoringDetail()
  isOpenModal.value = result
}

async function fetchMonitoringDetail() {
  serviceLoadingStart()
  const response = await apiMonitoringDetail(monitoringDetailRequest.value!)
  if (response === null) {
    serviceLoadingFinish()
    return false
  }

  monitoringDetails.value = response.data
  monitoringDetailTotal.value = response.total
  serviceLoadingFinish()

  return true
}

async function csvExportMonitoringDetail() {
  serviceLoadingStart()
  await apiMonitoringDetailCsvExport(monitoringDetailRequest.value!)
  serviceLoadingFinish()
}

function openEffectiveness() {
  const selectedSkus =
    formData.value.skuMonitoringUnitType === SkuMonitoringUnitTypes.Sku
      ? selectedRows.value.map((v) => {
          return {
            skuId: v.targetId,
            skuName: v[0].replace(v.targetId + ' ', ''),
          }
        })
      : []
  const selectedGroups =
    formData.value.skuMonitoringUnitType === SkuMonitoringUnitTypes.Group
      ? selectedRows.value.map((v) => {
          return {
            groupId: v.targetId,
            groupName: v[0].replace(v.targetId + ' ', ''),
          }
        })
      : []
  const selectedDepartments =
    formData.value.skuMonitoringUnitType === SkuMonitoringUnitTypes.Department
      ? selectedRows.value.map((v) => {
          return {
            departmentId: v.targetId,
            departmentName: v[0].replace(v.targetId + ' ', ''),
          }
        })
      : []
  const selectedLines =
    formData.value.skuMonitoringUnitType === SkuMonitoringUnitTypes.Line
      ? selectedRows.value.map((v) => {
          return {
            lineId: v.targetId,
            lineName: v[0].replace(v.targetId + ' ', ''),
          }
        })
      : []
  const selectedClasses =
    formData.value.skuMonitoringUnitType === SkuMonitoringUnitTypes.Class
      ? selectedRows.value.map((v) => {
          return {
            classId: v.targetId,
            className: v[0].replace(v.targetId + ' ', ''),
          }
        })
      : []

  // 現在の検索情報を効果測定の検索画面用に保持する
  frontCacheSet(
    'effectivenessFormData',
    {
      skuMonitoringUnitType: formData.value.skuMonitoringUnitType,
      from: formData.value.targetDateFrom,
      to: formData.value.targetDateTo,
      skus: selectedSkus,
      groups: selectedGroups,
      departments: selectedDepartments,
      classes: selectedClasses,
      lines: selectedLines,
      stores: formData.value.stores,
    },
    true
  )

  window.open('/effectiveness', '_blank')
}
</script>

<style scoped lang="postcss">
:deep(div.fixed-name > table) {
  > thead > tr > th:first-child {
    z-index: 5;
    position: sticky;
    left: 0;
    background: white;
    &:before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      border: 1px solid #ccc;
    }
  }

  > tbody > tr > td:first-child {
    z-index: 5;
    position: sticky;
    left: 0;
    background: white;
    &:before {
      content: '';
      position: absolute;
      top: -1px;
      left: -1px;
      border: 1px solid #ccc;
    }
  }

  > tbody > tr:hover > td {
    @apply bg-gray-50;
  }
}
</style>
