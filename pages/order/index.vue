<template>
  <div>
    <CommonHeader title="発注修正" />

    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-6' },
      }"
    >
      <UForm :state="{}">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Left Column: Inputs -->
          <div class="flex-1 space-y-6">
            <!-- 対象期間 -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <label
                class="whitespace-nowrap font-bold text-gray-700 sm:w-24 sm:text-right"
              >
                対象期間
              </label>
              <div class="flex items-center gap-4">
                <div class="w-40">
                  <CommonDatepicker v-model="formData.from" />
                </div>
                <span class="text-gray-400">～</span>
                <div class="w-40">
                  <CommonDatepicker v-model="formData.to" />
                </div>
              </div>
            </div>

            <!-- 対象単位 -->
            <div class="flex flex-col gap-4 sm:flex-row">
              <label
                class="mt-2 whitespace-nowrap font-bold text-gray-700 sm:w-24 sm:text-right"
              >
                対象単位
              </label>
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-4">
                  <div class="w-48">
                    <CommonSelect
                      v-model:selected="formData.skuMonitoringUnitType"
                      class="w-full"
                      :options="SkuMonitoringUnitTypes.getNameValues()"
                      @change="onChangedSkuMonitoringUnitType"
                    />
                  </div>
                  <UButton color="indigo" variant="soft" @click="openSkuModal"
                    >選択</UButton
                  >
                </div>

                <div
                  v-if="apiValidationError?.exists('skuMonitoringUnitType')"
                  class="mb-2 text-sm text-red-500"
                >
                  {{ apiValidationError?.first('skuMonitoringUnitType') }}
                </div>

                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="(sku, index) in formData.skus"
                    :key="sku.skuId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                  <template
                    v-for="(group, index) in formData.groups"
                    :key="group.groupId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                  <template
                    v-for="(department, index) in formData.departments"
                    :key="department.departmentId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                  <template
                    v-for="(clazz, index) in formData.classes"
                    :key="clazz.classId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                  <template
                    v-for="(line, index) in formData.lines"
                    :key="line.lineId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                </div>
              </div>
            </div>

            <!-- 対象店舗 -->
            <div class="flex flex-col gap-4 sm:flex-row">
              <label
                class="mt-2 whitespace-nowrap font-bold text-gray-700 sm:w-24 sm:text-right"
              >
                対象店舗
              </label>
              <div class="flex-1">
                <div class="mb-2 flex items-center gap-4">
                  <div class="w-48">
                    <CommonSelect
                      v-model:selected="formData.storeMonitoringUnitType"
                      class="w-full"
                      :options="StoreMonitoringUnitTypes.getNameValues()"
                    />
                  </div>
                  <UButton
                    color="indigo"
                    variant="soft"
                    :disabled="
                      formData.storeMonitoringUnitType ===
                      StoreMonitoringUnitTypes.All
                    "
                    @click="openStoreModal"
                    >選択</UButton
                  >
                </div>

                <div
                  v-if="apiValidationError?.exists('storeMonitoringUnitType')"
                  class="mb-2 text-sm text-red-500"
                >
                  {{ apiValidationError?.first('storeMonitoringUnitType') }}
                </div>

                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="(store, index) in formData.stores"
                    :key="store.storeId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                  <template
                    v-for="(storeGroup, index) in formData.storeGroups"
                    :key="storeGroup.storeGroupId"
                  >
                    <UBadge color="gray" variant="subtle" size="md">
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
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Actions -->
          <div
            class="flex items-end justify-end gap-3 border-t border-gray-100 pt-6 lg:flex-col lg:border-l lg:border-gray-100 lg:pl-8 lg:pt-0"
          >
            <UButton
              color="gray"
              variant="ghost"
              @click="reset"
              icon="i-heroicons-arrow-path"
              class="w-full justify-center lg:w-40"
            >
              リセット
            </UButton>
            <UButton
              color="indigo"
              @click="get(1)"
              icon="i-heroicons-magnifying-glass"
              class="w-full justify-center lg:w-40"
            >
              検索する
            </UButton>
            <UButton
              color="primary"
              variant="outline"
              icon="i-heroicons-document-arrow-down"
              label="エビデンス出力"
              @click="onExport"
              class="w-full justify-center lg:mt-auto lg:w-40"
            />
          </div>
        </div>
      </UForm>
    </UCard>

    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-0 sm:p-0' },
      }"
      class="mt-6"
    >
      <UTable :rows="orders" :columns="orderColumns" class="w-full">
        <template #objectiveDate-data="{ row }">
          <span class="font-medium text-gray-700">{{
            formatterDate(row.objectiveDate)
          }}</span>
        </template>
        <template #deliveryDate-data="{ row }">
          <span class="font-medium text-gray-700">{{
            formatterDate(row.deliveryDate)
          }}</span>
        </template>
        <template #storeId-data="{ row }">
          {{ row.storeMaster?.storeName }}
        </template>
        <template #skuId-data="{ row }">
          <span class="font-medium text-gray-900">{{
            row.storeSkuMaster?.skuName
          }}</span>
        </template>
        <template #groupId-data="{ row }">
          {{ row.groupMaster?.groupName }}
        </template>
        <template #departmentId-data="{ row }">
          {{ row.departmentMaster?.departmentName }}
        </template>
        <template #lineId-data="{ row }">
          {{ row.lineMaster?.lineName }}
        </template>
        <template #classId-data="{ row }">
          {{ row.classMaster?.className }}
        </template>
        <template #predictionOrderQty-data="{ row }">
          <p class="text-right">
            {{ formatterNumber(row.predictionOrderQty) }}
          </p>
        </template>
        <template #actualOrderQty-data="{ row }">
          <UTooltip
            v-if="
              new Date(row.objectiveDate).getTime() <
              new Date().setHours(0, 0, 0, 0)
            "
            text="当日以外の発注は変更できません"
            :popper="{ placement: 'top' }"
          >
            <UInput v-model.lazy="row.actualOrderQty" type="number" disabled />
          </UTooltip>
          <UInput
            v-else
            v-model.lazy="row.actualOrderQty"
            type="number"
            @change="onChangedActualOrderQty(row)"
          />
        </template>
      </UTable>

      <div
        v-if="orderTotal > 0"
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500">
          全 {{ formatterNumber(orderTotal) }} 件のご確認
        </span>
        <UPagination
          v-model="paginationPage"
          :page-count="formData.perPage"
          :max="5"
          :total="orderTotal"
        />
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        該当する発注データは見つかりませんでした。
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
