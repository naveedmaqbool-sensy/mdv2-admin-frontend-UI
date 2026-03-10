<template>
  <div>
    <CommonHeader title="発注条件マスタ 商品別一覧" />

    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-4 sm:p-6' },
      }"
    >
      <UForm :state="{}">
        <div class="space-y-4">
          <!-- 対象期間 -->
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <label
              class="shrink-0 font-bold text-gray-700 sm:w-28 sm:text-right"
              >期間</label
            >
            <div class="flex items-center gap-2">
              <div class="w-40 max-w-full">
                <CommonDatepicker v-model="formData.from" />
              </div>
              <span class="text-gray-500">～</span>
              <div class="w-40 max-w-full">
                <CommonDatepicker v-model="formData.to" />
              </div>
            </div>
          </div>

          <!-- 対象単位 -->
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <label
              class="shrink-0 font-bold text-gray-700 sm:w-28 sm:pt-1.5 sm:text-right"
              >商品</label
            >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <div class="w-48 max-w-full">
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
                class="mt-1 text-sm text-red-500"
              >
                {{ apiValidationError?.first('skuMonitoringUnitType') }}
              </div>

              <div class="mt-2 flex flex-wrap gap-2">
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
          <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <label
              class="shrink-0 font-bold text-gray-700 sm:w-28 sm:pt-1.5 sm:text-right"
              >店舗</label
            >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <div class="w-48 max-w-full">
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
                class="mt-1 text-sm text-red-500"
              >
                {{ apiValidationError?.first('storeMonitoringUnitType') }}
              </div>

              <div class="mt-2 flex flex-wrap gap-2">
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

        <!-- Actions -->
        <div
          class="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row"
        >
          <div class="flex w-full justify-start sm:w-auto">
            <UButton color="gray" variant="ghost" @click="reset"
              >リセット</UButton
            >
            <UButton color="indigo" class="ml-2" @click="fetch(1)"
              >検索する</UButton
            >
          </div>
          <div class="flex w-full justify-end sm:w-auto">
            <UButton
              color="primary"
              variant="outline"
              label="CSV出力"
              @click="onExport"
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
      <UTable
        :rows="orderConditionsMasters"
        :columns="orderConditionsColumns"
        class="w-full"
      >
        <template #actions-data="{ row }">
          <UButton
            color="indigo"
            variant="ghost"
            icon="i-heroicons-pencil-square"
            :to="`/order-conditions/${row.id}`"
          >
            編集
          </UButton>
        </template>

        <template #date-data="{ row }">
          <span class="font-medium text-gray-700">
            {{ formatterDate(row.orderConditionStartDate) }} ~
            {{ formatterDate(row.orderConditionEndDate) }}
          </span>
        </template>

        <template #orderingMethod-header="{ column }">
          <UTooltip
            :ui="{
              base: 'h-auto',
            }"
          >
            <template #text>
              <div
                v-for="orderingMethodType in OrderingMethodTypes.all()"
                :key="orderingMethodType"
              >
                {{ orderingMethodType }} :
                {{ OrderingMethodTypes.getName(orderingMethodType) }}
              </div>
            </template>
            <template #default>
              <span>
                {{ column.label }}
                <UIcon
                  name="i-heroicons-question-mark-circle"
                  class="h-4 w-4"
                />
              </span>
            </template>
          </UTooltip>
        </template>
        <template #orderingMethod-data="{ row }">
          <UTooltip placement="top" :popper="{ placement: 'right' }">
            <template #text>
              {{ OrderingMethodTypes.getName(row.orderingMethod) }}
            </template>
            <template #default>
              {{ row.orderingMethod }}
            </template>
          </UTooltip>
        </template>

        <template #roundUpDownDefinition-header="{ column }">
          <UTooltip
            :ui="{
              base: 'h-auto',
            }"
          >
            <template #text>
              <div
                v-for="roundUpDownType in RoundUpDownTypes.all()"
                :key="roundUpDownType"
              >
                {{ roundUpDownType }} :
                {{ RoundUpDownTypes.getName(roundUpDownType) }}
              </div>
            </template>
            <template #default>
              <span>
                {{ column.label }}
                <UIcon
                  name="i-heroicons-question-mark-circle"
                  class="h-4 w-4"
                />
              </span>
            </template>
          </UTooltip>
        </template>
        <template #roundUpDownDefinition-data="{ row }">
          <UTooltip placement="top" :popper="{ placement: 'right' }">
            <template #text>
              {{ RoundUpDownTypes.getName(row.roundUpDownDefinition) }}
            </template>
            <template #default>
              {{ row.roundUpDownDefinition }}
            </template>
          </UTooltip>
        </template>

        <template #orderConditionPriority-header="{ column }">
          <UTooltip
            :ui="{
              base: 'h-auto',
            }"
          >
            <template #text> 数字が大きい方が優先される </template>
            <template #default>
              <span>
                {{ column.label }}
                <UIcon
                  name="i-heroicons-question-mark-circle"
                  class="h-4 w-4"
                />
              </span>
            </template>
          </UTooltip>
        </template>

        <template #deliveryType-header="{ column }">
          <UTooltip
            :ui="{
              base: 'h-auto',
            }"
          >
            <template #text>
              <div
                v-for="deliveryDateType in DeliveryDateTypes.all()"
                :key="deliveryDateType"
              >
                {{ deliveryDateType }} :
                {{ DeliveryDateTypes.getName(deliveryDateType) }}
              </div>
            </template>
            <template #default>
              <span>
                {{ column.label }}
                <UIcon
                  name="i-heroicons-question-mark-circle"
                  class="h-4 w-4"
                />
              </span>
            </template>
          </UTooltip>
        </template>
        <template #deliveryType-data="{ row }">
          <UTooltip placement="top" :popper="{ placement: 'right' }">
            <template #text>
              {{ DeliveryDateTypes.getName(row.deliveryType) }}
            </template>
            <template #default>
              {{ row.deliveryType }}
            </template>
          </UTooltip>
        </template>

        <template #cutDate-data="{ row }">
          {{ formatterDate(row.cutDate) }}
        </template>
      </UTable>

      <div
        v-if="orderConditionsTotal > 0"
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500">
          全 {{ formatterNumber(orderConditionsTotal) }} 件のご確認
        </span>
        <UPagination
          v-model="paginationPage"
          :page-count="formData.perPage"
          :max="5"
          :total="orderConditionsTotal"
        />
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        該当する発注条件データは見つかりませんでした。
      </div>
    </UCard>

    <!-- 各種モーダル -->
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
        { key: 'skuName', label: '商品' },
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
  </div>
</template>

<script setup lang="ts">
import type ApiValidationError from '~/types/classes/ApiValidationError'
import DeliveryDateTypes from '~/types/enums/DeliveryDateTypes'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import RoundUpDownTypes from '~/types/enums/RoundUpTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type OrderConditionsMaster from '~/types/interfaces/database/OrderConditionsMaster'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type StoreGroup from '~/types/interfaces/database/SensyCloud/StoreGroup'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'
import type OrderConditionsFormData from '~/types/interfaces/page/order-conditions/FormData'
import OrderConditionsFormDataFactory from '~/types/interfaces/page/order-conditions/FormDataFactory'

const frontCacheKey = 'orderConditionsFormData'

try {
  const history = window.history
  const state = history.state
  if (state && state.back) {
    const prevUrl = useNuxtApp().$router.resolve(state.back).href

    // 編集ページから戻ってきた場合はキャッシュから検索条件を取得する
    if (prevUrl.includes('order-conditions')) {
      if (
        prevUrl.split('/').length !== 3 ||
        !Number(prevUrl.split('/')[2].toString())
      ) {
        frontCacheRemove(frontCacheKey)
      }
    }
  }
} catch {}

const apiValidationError = ref<ApiValidationError | null>(null)
const formData = ref<OrderConditionsFormData>(
  frontCacheGet(frontCacheKey, true) || new OrderConditionsFormDataFactory()
)

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

const orderConditionsMasters = ref<OrderConditionsMaster[]>([])
const orderConditionsTotal = ref(0)
const paginationPage = computed({
  get: () => formData.value.page,
  set: (value) => {
    fetch(value)
  },
})
const orderConditionsColumns = [
  { key: 'actions', label: '操作' },
  { key: 'storeName', label: '店舗' },
  { key: 'skuId', label: 'JAN' },
  { key: 'groupName', label: '部門' },
  { key: 'departmentName', label: '中分類' },
  { key: 'lineName', label: '小分類' },
  { key: 'className', label: '細分類' },
  { key: 'skuName', label: '商品' },
  { key: 'date', label: '対象期間' },
  { key: 'orderConditionPriority', label: '優先度' },
  { key: 'orderingMethod', label: '発注方式' },
  { key: 'leadTimeOnMonday', label: '月LT' },
  { key: 'leadTimeOnTuesday', label: '火LT' },
  { key: 'leadTimeOnWednesday', label: '水LT' },
  { key: 'leadTimeOnThursday', label: '木LT' },
  { key: 'leadTimeOnFriday', label: '金LT' },
  { key: 'leadTimeOnSaturday', label: '土LT' },
  { key: 'leadTimeOnSunday', label: '日LT' },
  { key: 'orderLot', label: '発注ロット' },
  { key: 'roundUpDownDefinition', label: '切上下区分' },
  { key: 'minimumOrderQty', label: '最低発注数' },
  {
    key: 'displayStockQty',
    label: useNuxtApp().$config.public.displayStockName,
  },
  { key: 'displayLimitQty', label: '陳列上限数' },
  { key: 'cutDate', label: '終売日' },
  { key: 'deliveryType', label: '納品日判定区分' },
]

async function fetch(page: number) {
  formData.value.page = page
  serviceLoadingStart()
  const response = await apiOrderConditionsFetch({
    storeIds: formData.value.stores.map((v) => v.storeId),
    skuIds: formData.value.skus.map((v) => v.skuId),
    groupIds: formData.value.groups.map((v) => v.groupId),
    departmentIds: formData.value.departments.map((v) => v.departmentId),
    lineIds: formData.value.lines.map((v) => v.lineId),
    classIds: formData.value.classes.map((v) => v.classId),
    from: formData.value.from,
    to: formData.value.to,
    page,
    perPage: formData.value.perPage,
    sortBy: [],
    isDescending: false,
  })
  if (!response) {
    serviceLoadingFinish()
    return
  }

  // 検索に成功したら条件をキャッシュする
  frontCacheSet(frontCacheKey, formData.value, true)

  orderConditionsMasters.value = response.data
  orderConditionsTotal.value = response.total

  serviceLoadingFinish()
}
await fetch(1)

function onChangedSkuMonitoringUnitType() {
  // 単位を切り替えたら選択しているものを削除する
  formData.value.skus = []
  formData.value.groups = []
  formData.value.departments = []
  formData.value.classes = []
  formData.value.lines = []
}

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

function reset() {
  formData.value = new OrderConditionsFormDataFactory()
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

async function onExport() {
  await apiOrderConditionsCsvExport({
    storeIds: formData.value.stores.map((v) => v.storeId),
    skuIds: formData.value.skus.map((v) => v.skuId),
    groupIds: formData.value.groups.map((v) => v.groupId),
    departmentIds: formData.value.departments.map((v) => v.departmentId),
    lineIds: formData.value.lines.map((v) => v.lineId),
    classIds: formData.value.classes.map((v) => v.classId),
    from: formData.value.from,
    to: formData.value.to,
    sortBy: formData.value.sortBy,
    isDescending: formData.value.isDescending,
  })
}
</script>
