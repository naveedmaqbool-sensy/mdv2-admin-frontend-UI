<template>
  <div class="space-y-6">
    <!-- Header Area -->
    <div
      class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          発注修正
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          指定条件に基づく発注候補を確認・修正できます
        </p>
      </div>
      <div
        v-if="formData.from && formData.to"
        class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm"
      >
        <UIcon name="i-heroicons-calendar" class="h-4 w-4 text-gray-400" />
        対象期間: {{ formatterDate(formData.from) }} 〜
        {{ formatterDate(formData.to) }}
      </div>
    </div>

    <!-- Filter Card (Compact Toolbar) -->
    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-4 sm:p-5' },
        rounded: 'rounded-xl',
        background: 'bg-white',
      }"
    >
      <div
        class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
      >
        <div class="flex flex-1 flex-col gap-4 xl:flex-row xl:items-center">
          <!-- 期間 -->
          <div class="flex items-center gap-2">
            <span class="w-10 text-sm font-semibold text-gray-700">期間</span>
            <CommonDatepicker v-model="formData.from" class="w-32" />
            <span class="text-gray-400">-</span>
            <CommonDatepicker v-model="formData.to" class="w-32" />
          </div>

          <div class="hidden h-6 w-px bg-gray-200 xl:block"></div>

          <!-- 商品 -->
          <div class="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <span class="w-10 text-sm font-semibold text-gray-700">商品</span>
            <CommonSelect
              v-model:selected="formData.skuMonitoringUnitType"
              class="w-40"
              :options="SkuMonitoringUnitTypes.getNameValues()"
              @change="onChangedSkuMonitoringUnitType"
            />
            <UButton
              color="gray"
              variant="soft"
              icon="i-heroicons-plus"
              size="sm"
              @click="openSkuModal"
              >選択</UButton
            >
            <div
              v-if="apiValidationError?.exists('skuMonitoringUnitType')"
              class="ml-2 text-xs text-red-500"
            >
              {{ apiValidationError?.first('skuMonitoringUnitType') }}
            </div>
          </div>

          <div class="hidden h-6 w-px bg-gray-200 xl:block"></div>

          <!-- 店舗 -->
          <div class="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <span class="w-10 text-sm font-semibold text-gray-700">店舗</span>
            <CommonSelect
              v-model:selected="formData.storeMonitoringUnitType"
              class="w-40"
              :options="StoreMonitoringUnitTypes.getNameValues()"
            />
            <UButton
              color="gray"
              variant="soft"
              icon="i-heroicons-plus"
              size="sm"
              :disabled="
                formData.storeMonitoringUnitType ===
                StoreMonitoringUnitTypes.All
              "
              @click="openStoreModal"
              >選択</UButton
            >
            <div
              v-if="apiValidationError?.exists('storeMonitoringUnitType')"
              class="ml-2 text-xs text-red-500"
            >
              {{ apiValidationError?.first('storeMonitoringUnitType') }}
            </div>
          </div>
        </div>

        <div class="mt-2 flex shrink-0 items-center justify-end gap-3 xl:mt-0">
          <UButton
            color="gray"
            variant="ghost"
            class="text-gray-500 hover:text-gray-900"
            @click="reset"
            >リセット</UButton
          >
          <UButton
            color="indigo"
            variant="solid"
            icon="i-heroicons-magnifying-glass"
            class="rounded-lg px-6 font-medium shadow-sm"
            @click="get(1)"
            >検索する</UButton
          >
        </div>
      </div>

      <!-- Selected Tags -->
      <div
        v-if="hasSelectedFilters"
        class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 text-sm"
      >
        <span class="mr-1 text-xs font-medium text-gray-400">選択中:</span>
        <template v-for="(sku, index) in formData.skus" :key="sku.skuId">
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ sku.skuName }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.skus.splice(index, 1)"
            />
          </UBadge>
        </template>
        <template
          v-for="(group, index) in formData.groups"
          :key="group.groupId"
        >
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ group.groupName }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.groups.splice(index, 1)"
            />
          </UBadge>
        </template>
        <template
          v-for="(department, index) in formData.departments"
          :key="department.departmentId"
        >
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ department.departmentName }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.departments.splice(index, 1)"
            />
          </UBadge>
        </template>
        <template
          v-for="(clazz, index) in formData.classes"
          :key="clazz.classId"
        >
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ clazz.className }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.classes.splice(index, 1)"
            />
          </UBadge>
        </template>
        <template v-for="(line, index) in formData.lines" :key="line.lineId">
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ line.lineName }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.lines.splice(index, 1)"
            />
          </UBadge>
        </template>
        <template
          v-for="(store, index) in formData.stores"
          :key="store.storeId"
        >
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ store.storeName }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.stores.splice(index, 1)"
            />
          </UBadge>
        </template>
        <template
          v-for="(storeGroup, index) in formData.storeGroups"
          :key="storeGroup.storeGroupId"
        >
          <UBadge
            color="indigo"
            variant="subtle"
            size="sm"
            class="rounded-md bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"
          >
            {{ storeGroup.storeGroupName }}
            <UButton
              :padded="false"
              color="indigo"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-1 opacity-60 hover:opacity-100"
              @click="formData.storeGroups.splice(index, 1)"
            />
          </UBadge>
        </template>
      </div>
    </UCard>

    <!-- Summary Cards -->
    <div
      v-if="orderTotal > 0"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <UCard
        :ui="{
          ring: 'ring-1 ring-gray-100',
          shadow: 'shadow-sm',
          body: { padding: 'p-4' },
          rounded: 'rounded-xl',
          background: 'bg-white',
        }"
      >
        <p class="text-xs font-medium text-gray-500">対象件数</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">
          {{ formatterNumber(orderTotal) }}
          <span class="text-sm font-normal text-gray-400">件</span>
        </p>
      </UCard>
      <UCard
        :ui="{
          ring: 'ring-1 ring-gray-100',
          shadow: 'shadow-sm',
          body: { padding: 'p-4' },
          rounded: 'rounded-xl',
          background: 'bg-white',
        }"
      >
        <p class="text-xs font-medium text-gray-500">推奨合計</p>
        <p class="mt-1 text-2xl font-bold text-indigo-600">
          {{ formatterNumber(totalPrediction) }}
        </p>
      </UCard>
      <UCard
        :ui="{
          ring: 'ring-1 ring-gray-100',
          shadow: 'shadow-sm',
          body: { padding: 'p-4' },
          rounded: 'rounded-xl',
          background: 'bg-white',
        }"
      >
        <p class="text-xs font-medium text-gray-500">実発注合計</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">
          {{ formatterNumber(totalActual) }}
        </p>
      </UCard>
      <UCard
        :ui="{
          ring: 'ring-1 ring-gray-100',
          shadow: 'shadow-sm',
          body: { padding: 'p-4' },
          rounded: 'rounded-xl',
          background: 'bg-white',
        }"
      >
        <p class="text-xs font-medium text-gray-500">差分 (推奨 - 実発注)</p>
        <div class="mt-1 flex items-center gap-2">
          <p
            :class="[
              'text-2xl font-bold',
              totalDiff === 0 ? 'text-gray-400' : 'text-amber-600',
            ]"
          >
            {{ totalDiff > 0 ? '+' : '' }}{{ formatterNumber(totalDiff) }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Results Card -->
    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-0 sm:p-0' },
        rounded: 'rounded-xl',
        background: 'bg-white',
      }"
    >
      <div v-if="orderTotal > 0">
        <!-- Results Header -->
        <div
          class="flex items-center justify-between border-b border-gray-100 p-4 sm:px-6"
        >
          <h2 class="text-base font-bold text-gray-900">検索結果</h2>
          <UButton
            color="white"
            variant="solid"
            icon="i-heroicons-document-arrow-down"
            label="エビデンス出力"
            class="text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
            @click="onExport"
          />
        </div>

        <UTable
          :rows="orders"
          :columns="orderColumns"
          class="w-full"
          :ui="{
            th: {
              base: 'whitespace-nowrap bg-gray-50 text-gray-500 font-semibold text-xs',
              padding: 'py-3 px-4',
            },
            td: { padding: 'py-3 px-4 text-sm' },
          }"
        >
          <template #objectiveDate-data="{ row }">
            <span class="text-gray-600">{{
              formatterDate(row.objectiveDate)
            }}</span>
          </template>
          <template #deliveryDate-data="{ row }">
            <span class="text-gray-600">{{
              formatterDate(row.deliveryDate)
            }}</span>
          </template>
          <template #storeId-data="{ row }">
            <span class="font-medium text-gray-900">{{
              row.storeMaster?.storeName
            }}</span>
          </template>
          <template #skuId-data="{ row }">
            <span class="font-medium text-gray-900">{{
              row.storeSkuMaster?.skuName
            }}</span>
          </template>
          <template #groupId-data="{ row }">
            <UBadge
              v-if="row.groupMaster?.groupName"
              color="gray"
              variant="subtle"
              size="xs"
              >{{ row.groupMaster?.groupName }}</UBadge
            >
            <span v-else class="text-gray-400">-</span>
          </template>
          <template #departmentId-data="{ row }">
            <UBadge
              v-if="row.departmentMaster?.departmentName"
              color="gray"
              variant="subtle"
              size="xs"
              >{{ row.departmentMaster?.departmentName }}</UBadge
            >
            <span v-else class="text-gray-400">-</span>
          </template>
          <template #lineId-data="{ row }">
            <UBadge
              v-if="row.lineMaster?.lineName"
              color="gray"
              variant="subtle"
              size="xs"
              >{{ row.lineMaster?.lineName }}</UBadge
            >
            <span v-else class="text-gray-400">-</span>
          </template>
          <template #classId-data="{ row }">
            <UBadge
              v-if="row.classMaster?.className"
              color="gray"
              variant="subtle"
              size="xs"
              >{{ row.classMaster?.className }}</UBadge
            >
            <span v-else class="text-gray-400">-</span>
          </template>
          <template #predictionOrderQty-data="{ row }">
            <p
              class="rounded bg-indigo-50/50 px-2 py-1 text-right font-medium text-indigo-600"
            >
              {{ formatterNumber(row.predictionOrderQty) }}
            </p>
          </template>
          <template #actualOrderQty-data="{ row }">
            <UTooltip
              v-if="
                row.objectiveDate &&
                new Date(row.objectiveDate).getTime() <
                  new Date().setHours(0, 0, 0, 0)
              "
              text="当日以外の発注は変更できません"
              :popper="{ placement: 'top' }"
            >
              <UInput
                v-model.lazy="row.actualOrderQty"
                type="number"
                disabled
                class="ml-auto w-24"
              />
            </UTooltip>
            <UInput
              v-else
              v-model.lazy="row.actualOrderQty"
              type="number"
              class="ml-auto w-24"
              @change="onChangedActualOrderQty(row)"
            />
          </template>
        </UTable>

        <div
          class="flex flex-col items-center justify-between gap-4 rounded-b-xl border-t border-gray-100 bg-gray-50/50 p-4 sm:flex-row"
        >
          <span class="text-sm font-medium text-gray-500">
            全 {{ formatterNumber(orderTotal) }} 件のご確認
          </span>
          <UPagination
            v-model="paginationPage"
            :page-count="formData.perPage"
            :max="5"
            :total="orderTotal"
            :ui="{ wrapper: 'shadow-sm', rounded: 'rounded-md' }"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center p-16 text-center"
      >
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300 ring-8 ring-gray-50/50"
        >
          <UIcon name="i-heroicons-document-magnifying-glass" class="h-8 w-8" />
        </div>
        <h3 class="mb-1 text-lg font-bold text-gray-900">
          該当データがありません
        </h3>
        <p class="text-sm text-gray-500">
          条件に一致する発注データが見つかりませんでした。
        </p>
        <p class="text-sm text-gray-500">
          期間や対象条件を変更して再検索してください。
        </p>
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
    <OrderEvidenceExportModal
      v-model:is-open-modal="isActiveExportModal"
      :target-date-to="formData.to"
      :target-date-from="formData.from"
      :selected-skus="formData.skus"
      :selected-stores="formData.stores"
      @submit="exportOrderEvidence"
    />
  </div>
</template>

<script setup lang="ts">
import { apiOrderFetch } from '~/composables/api/order/Fetch'
import type ApiValidationError from '~/types/classes/ApiValidationError'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type StoreGroup from '~/types/interfaces/database/SensyCloud/StoreGroup'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'
import type OrderFormData from '~/types/interfaces/page/order/FormData'
import OrderFormDataFactory from '~/types/interfaces/page/order/FormDataFactory'

const orderColumns = [
  { key: 'objectiveDate', label: '発注日' },
  { key: 'deliveryDate', label: '納品日' },
  { key: 'storeId', label: '店舗名' },
  { key: 'skuId', label: 'SKU' },
  { key: 'groupId', label: '部門' },
  { key: 'departmentId', label: '中分類' },
  { key: 'lineId', label: '小分類' },
  { key: 'classId', label: '細分類' },
  { key: 'predictionOrderQty', label: '発注推奨数' },
  { key: 'actualOrderQty', label: '実発注数' },
]
const orders = ref<any[]>([]) // FIXME: rfukuma 型定義作ったら充てる
const orderTotal = ref(0)
const formData = ref<OrderFormData>(new OrderFormDataFactory())
const isOpenSkuModal = ref(false)
const skus = ref<any[]>([])
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
const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)
const paginationPage = computed({
  get: () => formData.value.page,
  set: (value) => {
    get(value)
  },
})

// Summary KPI Computed Properties
const hasSelectedFilters = computed(() => {
  return (
    formData.value.skus.length > 0 ||
    formData.value.groups.length > 0 ||
    formData.value.departments.length > 0 ||
    formData.value.classes.length > 0 ||
    formData.value.lines.length > 0 ||
    formData.value.stores.length > 0 ||
    formData.value.storeGroups.length > 0
  )
})

const totalPrediction = computed(() => {
  return orders.value.reduce(
    (sum, order) => sum + (Number(order.predictionOrderQty) || 0),
    0
  )
})

const totalActual = computed(() => {
  return orders.value.reduce(
    (sum, order) => sum + (Number(order.actualOrderQty) || 0),
    0
  )
})

const totalDiff = computed(() => {
  return totalActual.value - totalPrediction.value
})

async function reset() {
  formData.value = new OrderFormDataFactory()
  await get(1)
}

async function get(page: number) {
  formData.value.page = page
  serviceLoadingStart()
  const response = await apiOrderFetch(formData.value)
  serviceLoadingFinish()
  if (!response) {
    return
  }

  orders.value = response.data
  orderTotal.value = response.total
}
await get(1)

function openSkuModal() {
  switch (formData.value.skuMonitoringUnitType) {
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
  switch (formData.value.storeMonitoringUnitType) {
    case StoreMonitoringUnitTypes.All:
      break
    case StoreMonitoringUnitTypes.Store:
      isOpenStoreMasterModal.value = true
      break
    case StoreMonitoringUnitTypes.Area:
      isOpenStoreGroupModal.value = true
      break
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
  nextTick(serviceLoadingFinish)
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
  nextTick(serviceLoadingFinish)
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
  const response = await apiStoreGroupFetch(searchRequest)
  storeGroups.value = response ? response.data : []
  itemsTotal.value = response ? response.total : 0
  serviceLoadingFinish()
}

function onChangedSkuMonitoringUnitType() {
  // 単位を切り替えたら選択しているものを削除する
  formData.value.skus = []
  formData.value.groups = []
  formData.value.departments = []
  formData.value.classes = []
  formData.value.lines = []
}

function onChangedActualOrderQty(order: any) {
  nextTick(async () => {
    serviceLoadingStart()
    const response = await apiOrderUpdate({
      id: order.id,
      actualOrderQty: order.actualOrderQty,
    })
    serviceLoadingFinish()
    if (response === null) {
      return
    }

    useNuxtApp().$toast.success(
      order.storeMaster.storeName +
        'の' +
        order.storeSkuMaster.skuName +
        'の発注数を修正しました。'
    )
  })
}

const isActiveExportModal = ref(false)
function onExport() {
  const isSingleStore =
    formData.value.storeMonitoringUnitType === StoreMonitoringUnitTypes.Store &&
    formData.value.stores.length === 1
  const isSingleSku =
    formData.value.skuMonitoringUnitType === SkuMonitoringUnitTypes.Sku &&
    formData.value.skus.length === 1

  if (
    formData.value.from &&
    formData.value.to &&
    isSingleStore &&
    isSingleSku
  ) {
    exportOrderEvidence({
      from: formData.value.from!,
      to: formData.value.to!,
      sku: formData.value.skus[0],
      store: formData.value.stores[0],
    })
    return
  }

  isActiveExportModal.value = true
}

async function exportOrderEvidence(params: {
  from: Date
  to: Date
  sku: any
  store: StoreMaster
}) {
  // 出力処理を実行
  serviceLoadingStart()
  await apiOrderEvidenceExport(params)
  serviceLoadingFinish()
}
</script>
