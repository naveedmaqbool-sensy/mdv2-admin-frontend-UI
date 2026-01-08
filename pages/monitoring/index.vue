<template>
  <div>
    <CommonHeader title="モニタリング" />

    <!-- 検索条件 -->
    <UForm :state="{}">
      <section class="rounded border border-gray-300 px-4 py-2">
        <div class="flex flex-row">
          <div class="basis-1/6">
            <div class="flex items-center gap-1">
              <div class="basis-1/12"></div>
              <div class="basis-3/12 text-center font-bold">&nbsp;</div>
              <div class="w-full text-center -indent-3 font-bold">&nbsp;</div>
            </div>
            <UFormGroup class="pb-3">
              <div class="flex items-center gap-1">
                <label class="basis-10 whitespace-nowrap pr-2 font-bold">
                  指標
                </label>
                <CommonSelect
                  v-model:selected="formData.monitoringType"
                  class="w-full"
                  :options="MonitoringTypes.getMonitoringNameValues()"
                />
                <div></div>
              </div>
            </UFormGroup>
          </div>
          <div class="ml-3 basis-3/4">
            <div class="flex items-center gap-1">
              <div class="basis-10"></div>
              <div class="basis-2/12 text-center font-bold">【取得単位】</div>
              <div class="basis-2/12 text-center font-bold">【取得範囲】</div>
              <div class="basis-12"></div>
            </div>

            <!-- 商品選択 -->
            <UFormGroup class="pb-3">
              <div class="flex items-center gap-1">
                <label class="basis-10 whitespace-nowrap font-bold">商品</label>
                <CommonSelect
                  v-model:selected="formData.skuMonitoringUnitType"
                  class="basis-2/12"
                  :options="SkuMonitoringUnitTypes.getNameValues()"
                  @change="onChangedSkuMonitoringUnitType"
                />
                <CommonSelect
                  v-model:selected="formData.skuMonitoringRangeType"
                  class="basis-2/12"
                  :options="
                    skuRangeTypes.map((v) => {
                      return {
                        name: SkuMonitoringUnitTypes.getName(v),
                        value: v,
                      }
                    })
                  "
                  placeholder="-"
                  @change="onChangedSkuMonitoringRangeType"
                />
                <div class="basis-12">
                  <UButton
                    color="indigo"
                    :disabled="formData.skuMonitoringRangeType === null"
                    @click="openSkuModal"
                  >
                    選択
                  </UButton>
                </div>
              </div>
            </UFormGroup>
            <!-- バリデーションエラー -->
            <div
              v-if="apiValidationError?.exists('skuMonitoringRangeType')"
              class="-mt-1 pb-3 text-red-400"
            >
              {{ apiValidationError.first('skuMonitoringRangeType') }}
            </div>
            <div
              v-else-if="apiValidationError?.exists('skuMonitoringUnitType')"
              class="-mt-1 pb-3 text-red-400"
            >
              {{ apiValidationError.first('skuMonitoringUnitType') }}
            </div>

            <!-- 選択内容を表示 -->
            <div v-if="formData.skus.length > 0" class="pb-3">
              <template v-for="(sku, index) in formData.skus" :key="sku.skuId">
                <UBadge class="ml-1" color="gray">
                  {{ sku.skuName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.skus.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <div v-if="formData.groups.length > 0" class="pb-3">
              <template
                v-for="(group, index) in formData.groups"
                :key="group.groupId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ group.groupName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.groups.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <div v-if="formData.departments.length > 0" class="pb-3">
              <template
                v-for="(department, index) in formData.departments"
                :key="department.departmentId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ department.departmentName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.departments.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <div v-if="formData.classes.length > 0" class="pb-3">
              <template
                v-for="(clazz, index) in formData.classes"
                :key="clazz.classId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ clazz.className }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.classes.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <div v-if="formData.lines.length > 0" class="pb-3">
              <template
                v-for="(line, index) in formData.lines"
                :key="line.lineId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ line.lineName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.lines.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>

            <!-- 店舗選択 -->
            <UFormGroup class="pb-3">
              <div class="flex items-center gap-1">
                <label class="basis-10 whitespace-nowrap font-bold">店舗</label>
                <CommonSelect
                  v-model:selected="formData.storeMonitoringUnitType"
                  class="basis-2/12"
                  :options="StoreMonitoringUnitTypes.getNameValues()"
                  @change="onChangedStoreMonitoringUnitType"
                />
                <CommonSelect
                  v-model:selected="formData.storeMonitoringRangeType"
                  class="basis-2/12"
                  :options="
                    storeRangeTypes.map((v) => {
                      return {
                        name: StoreMonitoringUnitTypes.getName(v),
                        value: v,
                      }
                    })
                  "
                  placeholder="-"
                  :disabled="
                    formData.storeMonitoringUnitType ===
                    StoreMonitoringUnitTypes.All
                  "
                  @change="onChangedStoreMonitoringRangeType"
                />
                <div class="basis-12">
                  <UButton
                    color="indigo"
                    :disabled="formData.storeMonitoringRangeType === null"
                    @click="openStoreModal"
                  >
                    選択
                  </UButton>
                </div>
              </div>
            </UFormGroup>

            <!-- バリデーションエラー -->
            <div
              v-if="apiValidationError?.exists('storeMonitoringRangeType')"
              class="-mt-1 pb-3 text-red-400"
            >
              {{ apiValidationError.first('storeMonitoringRangeType') }}
            </div>
            <div
              v-else-if="apiValidationError?.exists('storeMonitoringUnitType')"
              class="-mt-1 pb-3 text-red-400"
            >
              {{ apiValidationError.first('storeMonitoringUnitType') }}
            </div>

            <!-- 選択内容を表示 -->
            <div v-if="formData.stores.length > 0" class="pb-3">
              <template
                v-for="(store, index) in formData.stores"
                :key="store.storeId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ store.storeName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.stores.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <div v-if="formData.storeGroups.length > 0" class="pb-3">
              <template
                v-for="(storeGroup, index) in formData.storeGroups"
                :key="storeGroup.storeGroupId"
              >
                <UBadge class="ml-1" color="gray">
                  {{ storeGroup.storeGroupName }}
                  <UButton
                    :padded="false"
                    color="gray"
                    variant="link"
                    icon="i-heroicons-x-mark-20-solid"
                    @click="formData.storeGroups.splice(index, 1)"
                  />
                </UBadge>
              </template>
            </div>
            <UFormGroup class="pb-3">
              <div class="flex items-center gap-1">
                <label class="basis-10 whitespace-nowrap font-bold">期間</label>
                <CommonSelect
                  v-model:selected="formData.monitoringHorizontalAxisType"
                  class="basis-2/12"
                  :options="MonitoringHorizontalAxisTypes.getNameValues()"
                />
                <CommonDatepicker
                  v-model="formData.targetDateFrom"
                  class="basis-2/12"
                />
                <p class="basis-12 text-center">～</p>
                <CommonDatepicker
                  v-model="formData.targetDateTo"
                  class="basis-2/12"
                />
              </div>
            </UFormGroup>
            <!-- バリデーションエラー -->
            <div
              v-if="apiValidationError?.exists('targetDateFrom')"
              class="-mt-1 pb-3 text-red-400"
            >
              {{ apiValidationError.first('targetDateFrom') }}
            </div>
            <div
              v-if="apiValidationError?.exists('targetDateTo')"
              class="-mt-1 pb-3 text-red-400"
            >
              {{ apiValidationError.first('targetDateTo') }}
            </div>
          </div>
        </div>
      </section>

      <section class="flex pt-2">
        <div class="basis-1/2 text-left">
          <UButton color="white" @click="reset">リセット</UButton>
          <UButton class="ml-2" color="indigo" @click="fetch(1)">
            画面表示
          </UButton>
          <UButton
            v-if="canShowEffectiveness"
            class="ml-2"
            color="blue"
            :disabled="selectedRows.length === 0"
            @click="openEffectiveness"
          >
            選択行の効果測定を開く
          </UButton>
        </div>
        <div class="basis-1/2 text-right">
          <UButton
            color="primary"
            class="ml-2"
            :disabled="kpiRows.length === 0 || kpiHeaders.length === 0"
            @click="csvExport"
          >
            CSV出力
          </UButton>
        </div>
      </section>
    </UForm>

    <!-- 集計結果 -->
    <template v-if="kpiRows.length > 0 && kpiHeaders.length > 0">
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
      <UPagination
        v-model="paginationPage"
        :page-count="formData.perPage"
        :max="5"
        :total="kpiItemTotal"
      />
    </template>

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
  // 現在の検索情報を効果測定の検索画面用に保持する
  frontCacheSet(
    'effectivenessFormData',
    {
      skuMonitoringUnitType: formData.value.skuMonitoringUnitType,
      from: formData.value.targetDateFrom,
      to: formData.value.targetDateTo,
      skus: formData.value.skus,
      groups: formData.value.groups,
      departments: formData.value.departments,
      classes: formData.value.classes,
      lines: formData.value.lines,
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
