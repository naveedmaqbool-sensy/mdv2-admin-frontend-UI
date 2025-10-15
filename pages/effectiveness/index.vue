<template>
  <div>
    <CommonHeader title="効果測定" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 py-2">
        <!-- 対象商品 -->
        <div class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">対象商品</label>
          </div>
          <div
            class="flex basis-1/12 flex-col justify-center whitespace-nowrap pl-2"
          >
            <CommonSelect
              v-model:selected="selectedSkuMonitoringUnitType"
              class="basis-2/12"
              :options="SkuMonitoringUnitTypes.getNameValues()"
              @change="
                () => {
                  selectedSkus = []
                  selectedGroups = []
                  selectedDepartments = []
                  selectedLines = []
                  selectedClasses = []
                }
              "
            />
          </div>
          <div class="flex flex-col justify-center whitespace-nowrap pl-2">
            <UButton color="indigo" @click="openTargetModal">選択</UButton>
          </div>
        </div>
        <div v-if="apiValidationError.exists('skuId')" class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError.first('skuId') }}
          </div>
        </div>

        <div class="flex flex-row pt-2">
          <div v-if="selectedSkus.length > 0">
            <template v-for="(sku, index) in selectedSkus" :key="sku.skuId">
              <UBadge class="ml-1" color="gray">
                {{ sku.skuName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="selectedSkus.splice(index, 1)"
                />
              </UBadge>
            </template>
          </div>
          <div v-if="selectedGroups.length > 0">
            <template
              v-for="(group, index) in selectedGroups"
              :key="group.groupId"
            >
              <UBadge class="ml-1" color="gray">
                {{ group.groupName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="selectedGroups.splice(index, 1)"
                />
              </UBadge>
            </template>
          </div>
          <div v-if="selectedDepartments.length > 0">
            <template
              v-for="(department, index) in selectedDepartments"
              :key="department.departmentId"
            >
              <UBadge class="ml-1" color="gray">
                {{ department.departmentName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="selectedDepartments.splice(index, 1)"
                />
              </UBadge>
            </template>
          </div>
          <div v-if="selectedLines.length > 0">
            <template v-for="(line, index) in selectedLines" :key="line.lineId">
              <UBadge class="ml-1" color="gray">
                {{ line.lineName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="selectedLines.splice(index, 1)"
                />
              </UBadge>
            </template>
          </div>
          <div v-if="selectedClasses.length > 0">
            <template
              v-for="(clazz, index) in selectedClasses"
              :key="clazz.classId"
            >
              <UBadge class="ml-1" color="gray">
                {{ clazz.className }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="selectedClasses.splice(index, 1)"
                />
              </UBadge>
            </template>
          </div>
        </div>

        <!-- 対象店舗 -->
        <div class="flex flex-row pt-2">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold"> 対象店舗 </label>
          </div>
          <div class="flex flex-col justify-center whitespace-nowrap pl-2">
            <UButton color="indigo" @click="openStoreModal">選択</UButton>
          </div>
          <div v-if="selectedStores.length > 0">
            <template
              v-for="(store, index) in selectedStores"
              :key="store.storeId"
            >
              <UBadge class="ml-2 py-2" color="gray">
                {{ store.storeName }}
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  icon="i-heroicons-x-mark-20-solid"
                  @click="selectedStores.splice(index, 1)"
                />
              </UBadge>
            </template>
          </div>
        </div>
        <div v-if="apiValidationError?.exists('storeId')" class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('storeId') }}
          </div>
        </div>

        <!-- 対象期間 -->
        <div class="flex flex-row pt-2">
          <div class="my-auto basis-1/12 text-right">
            <label class="whitespace-nowrap pr-2 text-right font-bold">
              対象期間
            </label>
          </div>
          <div class="basis-1/12 pl-2">
            <CommonAppDatepicker
              v-model:date="from"
              v-model:type="targetDateRangeType"
            />
          </div>
          <div class="my-auto">～</div>
          <div class="basis-1/12">
            <CommonAppDatepicker
              v-model:date="to"
              :type="targetDateRangeType"
            />
          </div>
        </div>
        <div
          v-if="
            apiValidationError.exists('from') || apiValidationError.exists('to')
          "
          class="flex flex-row"
        >
          <div class="my-auto basis-1/12 text-right"></div>
          <div class="basis-auto text-red-400">
            <p v-if="apiValidationError.exists('from')">
              {{ apiValidationError.first('from') }}
            </p>
            <p v-if="apiValidationError.exists('to')">
              {{ apiValidationError.first('to') }}
            </p>
          </div>
        </div>
      </section>

      <section class="flex pt-2">
        <div class="basis-1/2 text-left">
          <UButton class="mr-2" color="white" @click="reset">リセット</UButton>
          <UButton color="indigo" @click="fetch()">画面表示</UButton>
        </div>
        <div class="basis-1/2 text-right"></div>
      </section>
    </UForm>

    <template v-for="category in categories">
      <section class="flex justify-between pt-5">
        <h1 class="flex text-base font-bold">
          <span>
            {{ category.storeName }}
            <svg
              class="inline-block h-4 w-4 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              className="size-6"
              @click="copyText(category.storeName)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
              />
            </svg>
          </span>
          <span v-if="showUnitType === SkuMonitoringUnitTypes.Sku" class="ml-5">
            {{ category.targetId }}
            <svg
              class="inline-block h-4 w-4 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              className="size-6"
              @click="copyText(category.targetId)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
              />
            </svg>
          </span>
          <span class="ml-5">
            {{ category.targetName }}
            <svg
              class="inline-block h-4 w-4 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="{1.5}"
              stroke="currentColor"
              className="size-6"
              @click="copyText(category.targetName)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
              />
            </svg>
          </span>
        </h1>
        <!-- 発注種別の表示 -->
        <div
          v-if="category.orderingMethodData.length > 0"
          class="flex justify-end"
        >
          <UTable
            class="fixed-name"
            :columns="[
              { key: 'orderingMethod', label: '発注方式' },
              { key: 'averageStockQty', label: '平均在庫数' },
              { key: 'noStockCount', label: '欠品回数' },
              { key: 'inventoryTurnoverRate', label: '在庫回転率' },
              { key: 'inventoryTurnoverDays', label: '在庫回転日数' },
            ]"
            :rows="category.orderingMethodData"
          >
            <template #orderingMethod-data="{ row }">
              <p
                :style="{
                  color: row.orderingMethod
                    ? OrderingMethodTypes.getGraphColor(row.orderingMethod)
                    : 'red',
                }"
              >
                {{
                  row.orderingMethod
                    ? OrderingMethodTypes.getName(row.orderingMethod)
                    : '未発注'
                }}
              </p>
            </template>
            <template #averageStockQty-data="{ row }">
              <p class="text-right">
                {{
                  formatterNumber(parseFloat(row.averageStockQty).toFixed(2))
                }}
              </p>
            </template>
            <template #noStockCount-data="{ row }">
              <p class="text-right">
                {{ formatterNumber(row.noStockCount) }}
                回
              </p>
            </template>
            <template #inventoryTurnoverRate-data="{ row }">
              <p class="text-right">
                {{
                  formatterNumber(
                    parseFloat(row.inventoryTurnoverRate).toFixed(2)
                  )
                }}
              </p>
            </template>
            <template #inventoryTurnoverDays-data="{ row }">
              <p class="text-right">
                {{
                  formatterNumber(
                    parseFloat(row.inventoryTurnoverDays).toFixed(2)
                  )
                }}
              </p>
            </template>
          </UTable>
        </div>
      </section>

      <EffectivenessLineChart
        v-if="category.data.length > 0"
        :categories="category.data"
        :height="500"
      />
      <div
        v-else
        class="flex bg-gray-200"
        :class="{
          'min-h-[560px] items-center justify-center': !category.errorMessage,
        }"
      >
        <svg
          v-if="!category.errorMessage"
          class="mb-1 mr-2 h-16 w-16 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p v-else class="text-base font-bold text-red-400">
          <svg
            class="inline-block h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="{1.5}"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          {{ category.errorMessage }}
        </p>
      </div>
    </template>

    <!-- 検索用モーダル -->
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenSkuModal"
      v-model:selected="selectedSkus"
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
      v-model:selected="selectedGroups"
      v-model:items="groups"
      v-model:total="itemsTotal"
      :columns="[{ key: 'groupName', label: '部門' }]"
      id-column-name="groupId"
      @fetch-items="fetchGroups"
    />
    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenDepartmentsModal"
      v-model:selected="selectedDepartments"
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
      v-model:selected="selectedLines"
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
      v-model:selected="selectedClasses"
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
      v-model:is-open-modal="isOpenStoreModal"
      v-model:selected="selectedStores"
      v-model:items="stores"
      v-model:total="itemsTotal"
      :columns="[{ key: 'storeName', label: '店舗' }]"
      id-column-name="storeId"
      @fetch-items="fetchStores"
    />
  </div>
</template>

<script setup lang="ts">
import copy from 'copy-text-to-clipboard'
import type ApiValidationError from '~/types/classes/ApiValidationError'
import OrderingMethodTypes from '~/types/enums/OrderingMethodTypes'
import TargetDateRangeTypes from '~/types/enums/TargetDateRangeTypes'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import type GroupMaster from '~/types/interfaces/database/SensyCloud/GroupMaster'
import type DepartmentMaster from '~/types/interfaces/database/SensyCloud/DepartmentMaster'
import type LineMaster from '~/types/interfaces/database/SensyCloud/LineMaster'
import type ClassMaster from '~/types/interfaces/database/SensyCloud/ClassMaster'

const categories = ref<
  {
    targetId: string
    targetName: string
    storeId: string
    storeName: string
    data: {
      name: string
      values: {
        row: string
        amount: number
      }[]
    }[]
    errorMessage: string | null
    orderingMethodData: {
      orderingMethod: OrderingMethodTypes | null
      averageStockQty: number
      noStockCount: number
      inventoryTurnoverRate: number
      inventoryTurnoverDays: number
    }[]
  }[]
>([])

function fetch() {
  serviceValidationErrorsReset()
  apiValidationError.value.refresh()
  apiValidationError.value = serviceValidationErrorsInstance()
  if (!from.value) {
    apiValidationError.value.set('from', '対象期間を指定してください。')
  } else if (!to.value) {
    apiValidationError.value.set('to', '対象期間を指定してください。')
  }

  if (
    selectedSkus.value.length === 0 &&
    selectedGroups.value.length === 0 &&
    selectedDepartments.value.length === 0 &&
    selectedLines.value.length === 0 &&
    selectedClasses.value.length === 0
  ) {
    apiValidationError.value.set('skuId', '対象商品を指定してください。')
  }

  if (selectedStores.value.length === 0) {
    apiValidationError.value.set('storeId', '対象店舗を指定してください。')
  }
  if (apiValidationError.value.exists()) {
    return
  }

  serviceLoadingToggleIgnore()

  categories.value = []
  selectedStores.value.forEach((store) => {
    switch (selectedSkuMonitoringUnitType.value) {
      case SkuMonitoringUnitTypes.Sku:
        selectedSkus.value.forEach((v) => {
          categories.value.push({
            targetId: v.skuId,
            targetName: v.skuName,
            storeId: store.storeId,
            storeName: store.storeName,
            data: [],
            errorMessage: null,
            orderingMethodData: [],
          })
        })
        break
      case SkuMonitoringUnitTypes.Group:
        selectedGroups.value.forEach((v) => {
          categories.value.push({
            targetId: v.groupId,
            targetName: v.groupName,
            storeId: store.storeId,
            storeName: store.storeName,
            data: [],
            errorMessage: null,
            orderingMethodData: [],
          })
        })
        break
      case SkuMonitoringUnitTypes.Department:
        selectedDepartments.value.forEach((v) => {
          categories.value.push({
            targetId: v.departmentId,
            targetName: v.departmentName,
            storeId: store.storeId,
            storeName: store.storeName,
            data: [],
            errorMessage: null,
            orderingMethodData: [],
          })
        })
        break
      case SkuMonitoringUnitTypes.Line:
        selectedLines.value.forEach((v) => {
          categories.value.push({
            targetId: v.lineId,
            targetName: v.lineName,
            storeId: store.storeId,
            storeName: store.storeName,
            data: [],
            errorMessage: null,
            orderingMethodData: [],
          })
        })
        break
      case SkuMonitoringUnitTypes.Class:
        selectedClasses.value.forEach((v) => {
          categories.value.push({
            targetId: v.classId,
            targetName: v.className,
            storeId: store.storeId,
            storeName: store.storeName,
            data: [],
            errorMessage: null,
            orderingMethodData: [],
          })
        })
        break
    }
  })

  categories.value.forEach(async (category, index) => {
    const response = await apiEffectivenessFetch({
      from: new Date(from.value!),
      to: new Date(to.value!),
      unitType: selectedSkuMonitoringUnitType.value,
      targetId: category.targetId,
      storeId: category.storeId,
      targetDateRangeType: targetDateRangeType.value,
    })
    if (!response) {
      categories.value[index].errorMessage = '予期せぬエラーが発生しました。'
      return
    }

    // エラーがある場合はそのほか取得できた情報の処理をしない
    if (response.errorMessage) {
      categories.value[index].errorMessage = response.errorMessage
      return
    }

    // 各取得情報の格納
    categories.value[index].data.push({
      name: '発注方式',
      values: response.records.map((v) => {
        return {
          row: v.objectiveDate,
          amount: v.orderingMethod,
        }
      }),
    })
    categories.value[index].data.push({
      name: '販売数',
      values: response.records.map((v) => {
        return {
          row: v.objectiveDate,
          amount: v.salesQty,
        }
      }),
    })
    categories.value[index].data.push({
      name: '在庫数',
      values: response.records.map((v) => {
        return {
          row: v.objectiveDate,
          amount: v.stockQty,
        }
      }),
    })

    categories.value[index].data.push({
      name: '入荷数',
      values: response.records.map((v) => {
        return {
          row: v.objectiveDate,
          amount: v.arrivalQty,
        }
      }),
    })
    if (selectedSkuMonitoringUnitType.value === SkuMonitoringUnitTypes.Sku) {
      categories.value[index].data.push({
        name: useNuxtApp().$config.public.displayStockName,
        values: response.records.map((v) => {
          return {
            row: v.objectiveDate,
            amount: v.displayStockQty,
          }
        }),
      })
    }

    categories.value[index].data.push({
      name: '推奨発注数',
      values: response.records.map((v) => {
        return {
          row: v.objectiveDate,
          amount: v.orderQty,
        }
      }),
    })
    categories.value[index].orderingMethodData = response.orderingMethodRecords
  })

  // グラフ表示用の区分を保持
  showUnitType.value = selectedSkuMonitoringUnitType.value
  serviceLoadingToggleIgnore()
}

const selectedSkuMonitoringUnitType = ref(SkuMonitoringUnitTypes.Sku)
const showUnitType = ref(selectedSkuMonitoringUnitType.value)
const targetDateRangeType = ref(TargetDateRangeTypes.Daily)
const from = ref<Date | null>(null)
const to = ref<Date | null>(null)
const skus = ref<any[]>([])
const selectedSkus = ref<any[]>([])
const groups = ref<GroupMaster[]>([])
const selectedGroups = ref<GroupMaster[]>([])
const departments = ref<DepartmentMaster[]>([])
const selectedDepartments = ref<DepartmentMaster[]>([])
const lines = ref<LineMaster[]>([])
const selectedLines = ref<LineMaster[]>([])
const classes = ref<ClassMaster[]>([])
const selectedClasses = ref<ClassMaster[]>([])
const stores = ref<StoreMaster[]>([])
const selectedStores = ref<StoreMaster[]>([])

const itemsTotal = ref(0)

const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)

const isOpenSkuModal = ref(false)
const isOpenGroupsModal = ref(false)
const isOpenDepartmentsModal = ref(false)
const isOpenLinesModal = ref(false)
const isOpenClassesModal = ref(false)

function openTargetModal() {
  apiValidationError.value.refresh()
  switch (selectedSkuMonitoringUnitType.value) {
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

const isOpenStoreModal = ref(false)
function openStoreModal() {
  isOpenStoreModal.value = true
  apiValidationError.value.refresh()
}

async function fetchSkus(searchRequest: {
  text: string | null
  page: number
  perPage: number
}) {
  serviceLoadingStart()
  const response = await apiSkuMasterFetch(searchRequest)
  skus.value = response?.data ?? []
  itemsTotal.value = response?.total ?? 0
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
  stores.value = response?.data ?? []
  itemsTotal.value = response?.total ?? 0
  serviceLoadingFinish()
}

function reset() {
  from.value = null
  to.value = null
  selectedSkus.value = []
  selectedGroups.value = []
  selectedDepartments.value = []
  selectedLines.value = []
  selectedClasses.value = []
  selectedStores.value = []
}

function copyText(copyMessage: string) {
  copy(copyMessage)
  useNuxtApp().$toast.success(`クリップボードに${copyMessage}をコピーしました`)
}
</script>

<style scoped></style>
