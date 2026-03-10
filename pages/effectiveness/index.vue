<template>
  <div>
    <CommonHeader title="効果測定" />

    <!-- Filter Bar (Responsive Neo-Glassmorphism) -->
    <div
      class="relative overflow-hidden rounded-2xl bg-white/70 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10"
      ></div>
      <UForm
        :state="{}"
        class="relative rounded-xl bg-white/50 p-5 backdrop-blur-md"
      >
        <div class="flex flex-col gap-8 xl:flex-row xl:items-start">
          <!-- Left Column: Inputs -->
          <div class="flex-1 space-y-7">
            <!-- 対象商品 -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
              <label
                class="mt-2 whitespace-nowrap text-sm font-bold tracking-wide text-gray-700 sm:w-28 sm:text-right"
              >
                対象商品
              </label>
              <div class="flex min-w-0 flex-1 flex-col gap-3">
                <div class="flex flex-wrap items-center gap-3">
                  <div
                    class="w-full max-w-[12rem] transition-all focus-within:ring-2 focus-within:ring-indigo-500/20"
                  >
                    <CommonSelect
                      v-model:selected="selectedSkuMonitoringUnitType"
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
                  <UButton
                    color="indigo"
                    variant="soft"
                    class="rounded-lg px-4 font-semibold shadow-sm transition-all hover:bg-indigo-100"
                    @click="openTargetModal"
                    >選択</UButton
                  >
                </div>

                <!-- Validation Error & Selected Badges -->
                <div
                  v-if="apiValidationError.exists('skuId')"
                  class="text-sm font-medium text-rose-500"
                >
                  {{ apiValidationError.first('skuId') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="(sku, index) in selectedSkus"
                    :key="sku.skuId"
                  >
                    <UBadge
                      color="gray"
                      variant="solid"
                      size="md"
                      class="bg-white/80 text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                    >
                      {{ sku.skuName }}
                      <UButton
                        :padded="false"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        class="ml-1 text-gray-400 hover:text-rose-500"
                        @click="selectedSkus.splice(index, 1)"
                      />
                    </UBadge>
                  </template>
                  <template
                    v-for="(group, index) in selectedGroups"
                    :key="group.groupId"
                  >
                    <UBadge
                      color="gray"
                      variant="solid"
                      size="md"
                      class="bg-white/80 text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                    >
                      {{ group.groupName }}
                      <UButton
                        :padded="false"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        class="ml-1 text-gray-400 hover:text-rose-500"
                        @click="selectedGroups.splice(index, 1)"
                      />
                    </UBadge>
                  </template>
                  <template
                    v-for="(department, index) in selectedDepartments"
                    :key="department.departmentId"
                  >
                    <UBadge
                      color="gray"
                      variant="solid"
                      size="md"
                      class="bg-white/80 text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                    >
                      {{ department.departmentName }}
                      <UButton
                        :padded="false"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        class="ml-1 text-gray-400 hover:text-rose-500"
                        @click="selectedDepartments.splice(index, 1)"
                      />
                    </UBadge>
                  </template>
                  <template
                    v-for="(line, index) in selectedLines"
                    :key="line.lineId"
                  >
                    <UBadge
                      color="gray"
                      variant="solid"
                      size="md"
                      class="bg-white/80 text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                    >
                      {{ line.lineName }}
                      <UButton
                        :padded="false"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        class="ml-1 text-gray-400 hover:text-rose-500"
                        @click="selectedLines.splice(index, 1)"
                      />
                    </UBadge>
                  </template>
                  <template
                    v-for="(clazz, index) in selectedClasses"
                    :key="clazz.classId"
                  >
                    <UBadge
                      color="gray"
                      variant="solid"
                      size="md"
                      class="bg-white/80 text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                    >
                      {{ clazz.className }}
                      <UButton
                        :padded="false"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        class="ml-1 text-gray-400 hover:text-rose-500"
                        @click="selectedClasses.splice(index, 1)"
                      />
                    </UBadge>
                  </template>
                </div>
              </div>
            </div>

            <!-- 対象店舗 -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
              <label
                class="mt-2 whitespace-nowrap text-sm font-bold tracking-wide text-gray-700 sm:w-28 sm:text-right"
              >
                対象店舗
              </label>
              <div class="flex min-w-0 flex-1 flex-col gap-3">
                <div class="flex items-center">
                  <UButton
                    color="indigo"
                    variant="soft"
                    class="rounded-lg px-4 font-semibold shadow-sm transition-all hover:bg-indigo-100"
                    @click="openStoreModal"
                    >選択</UButton
                  >
                </div>
                <div
                  v-if="apiValidationError?.exists('storeId')"
                  class="text-sm font-medium text-rose-500"
                >
                  {{ apiValidationError?.first('storeId') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="(store, index) in selectedStores"
                    :key="store.storeId"
                  >
                    <UBadge
                      color="gray"
                      variant="solid"
                      size="md"
                      class="bg-white/80 py-1 text-gray-700 shadow-sm ring-1 ring-gray-200 backdrop-blur-sm"
                    >
                      {{ store.storeName }}
                      <UButton
                        :padded="false"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        class="ml-1 text-gray-400 hover:text-rose-500"
                        @click="selectedStores.splice(index, 1)"
                      />
                    </UBadge>
                  </template>
                </div>
              </div>
            </div>

            <!-- 対象期間 -->
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
              <label
                class="mt-2 whitespace-nowrap text-sm font-bold tracking-wide text-gray-700 sm:w-28 sm:text-right"
              >
                対象期間
              </label>
              <div class="flex min-w-0 flex-1 flex-col gap-2">
                <div class="flex flex-wrap items-center gap-3">
                  <div
                    class="w-[45%] min-w-[140px] max-w-[180px] transition-all focus-within:ring-2 focus-within:ring-indigo-500/20"
                  >
                    <CommonAppDatepicker
                      v-model:date="from"
                      v-model:type="targetDateRangeType"
                    />
                  </div>
                  <span class="font-light text-gray-400">～</span>
                  <div
                    class="w-[45%] min-w-[140px] max-w-[180px] transition-all focus-within:ring-2 focus-within:ring-indigo-500/20"
                  >
                    <CommonAppDatepicker
                      v-model:date="to"
                      :type="targetDateRangeType"
                    />
                  </div>
                </div>
                <div class="text-sm font-medium text-rose-500">
                  <p v-if="apiValidationError.exists('from')">
                    {{ apiValidationError.first('from') }}
                  </p>
                  <p v-if="apiValidationError.exists('to')">
                    {{ apiValidationError.first('to') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Actions -->
          <div
            class="flex flex-row items-center justify-end gap-3 border-t border-gray-100/80 pt-6 xl:flex-col xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              class="rounded-full px-5 transition-colors hover:bg-gray-100/80 xl:w-32 xl:justify-center"
              @click="reset"
            >
              リセット
            </UButton>
            <UButton
              color="indigo"
              icon="i-heroicons-presentation-chart-line"
              class="rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 xl:w-32 xl:justify-center"
              @click="fetch()"
            >
              画面表示
            </UButton>
          </div>
        </div>
      </UForm>
    </div>

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
          <template v-if="showUnitType !== SkuMonitoringUnitTypes.Sku">
            <div class="mr-5">
              <UButton
                color="blue"
                @click="showChild(category.targetId, category.storeId)"
              >
                配下の{{ childTargetName }}を表示
              </UButton>
            </div>
          </template>
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
                    : '#999999',
                }"
              >
                {{
                  row.orderingMethod
                    ? OrderingMethodTypes.getName(row.orderingMethod)
                    : '対象外'
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

let fetchIndex = -1
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

  // 表示に使用する枠を作成する
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

  // グラフ表示用の区分を保持
  showUnitType.value = selectedSkuMonitoringUnitType.value

  // 枠に対して表示する情報を取得するAPIを実行する
  // 3枠先に固定で取得するのについては、食表示で画面内に収まるデータは取得したい意図
  fetchIndex = -1
  for (let i = 0; i < 3; i++) {
    fetchPromise()
  }

  // 検索の実行を確認出来たら検索条件のキャッシュを削除（モニタリングからの遷移以外や再検索防止）
  frontCacheRemove('effectivenessFormData')
}

async function fetchPromise() {
  ++fetchIndex
  if (fetchIndex >= categories.value.length) {
    serviceLoadingToggleIgnore()
    return
  }
  const category = categories.value[fetchIndex]

  const response = await apiEffectivenessFetch({
    from: new Date(from.value!),
    to: new Date(to.value!),
    unitType: showUnitType.value,
    targetId: category.targetId,
    storeId: category.storeId,
    targetDateRangeType: targetDateRangeType.value,
  })

  if (!response) {
    category.errorMessage = '予期せぬエラーが発生しました。'
    fetchPromise()
    return
  }

  // エラーがある場合はそのほか取得できた情報の処理をしない
  if (response.errorMessage) {
    category.errorMessage = response.errorMessage
    fetchPromise()
    return
  }

  // 各取得情報の格納
  category.data.push({
    name: '発注方式',
    values: response.records.map((v) => {
      return {
        row: v.objectiveDate,
        amount: v.orderingMethod,
      }
    }),
  })
  category.data.push({
    name: '販売数',
    values: response.records.map((v) => {
      return {
        row: v.objectiveDate,
        amount: v.salesQty,
      }
    }),
  })
  category.data.push({
    name: '在庫数',
    values: response.records.map((v) => {
      return {
        row: v.objectiveDate,
        amount: v.stockQty,
      }
    }),
  })

  category.data.push({
    name: '入荷数',
    values: response.records.map((v) => {
      return {
        row: v.objectiveDate,
        amount: v.arrivalQty,
      }
    }),
  })
  if (showUnitType.value === SkuMonitoringUnitTypes.Sku) {
    category.data.push({
      name: useNuxtApp().$config.public.displayStockName,
      values: response.records.map((v) => {
        return {
          row: v.objectiveDate,
          amount: v.displayStockQty,
        }
      }),
    })
  }

  category.data.push({
    name: '推奨発注数',
    values: response.records.map((v) => {
      return {
        row: v.objectiveDate,
        amount: v.orderQty,
      }
    }),
  })
  category.orderingMethodData = response.orderingMethodRecords

  fetchPromise()
}

const cacheFormData = frontCacheGet('effectivenessFormData', true)

const selectedSkuMonitoringUnitType = ref(
  cacheFormData?.skuMonitoringUnitType || SkuMonitoringUnitTypes.Sku
)
const showUnitType = ref(selectedSkuMonitoringUnitType.value)
const targetDateRangeType = ref(TargetDateRangeTypes.Daily) // 現状効果測定は日次のみのため、期間指定の種類は固定でOK
const from = ref<Date | null>(cacheFormData?.from || null)
const to = ref<Date | null>(cacheFormData?.to || null)
const skus = ref<any[]>([])
const selectedSkus = ref<any[]>(cacheFormData?.skus || [])
const groups = ref<GroupMaster[]>([])
const selectedGroups = ref<GroupMaster[]>(cacheFormData?.groups || [])
const departments = ref<DepartmentMaster[]>([])
const selectedDepartments = ref<DepartmentMaster[]>(
  cacheFormData?.departments || []
)
const lines = ref<LineMaster[]>([])
const selectedLines = ref<LineMaster[]>(cacheFormData?.lines || [])
const classes = ref<ClassMaster[]>([])
const selectedClasses = ref<ClassMaster[]>(cacheFormData?.classes || [])
const stores = ref<StoreMaster[]>([])
const selectedStores = ref<StoreMaster[]>(cacheFormData?.stores || [])

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

// キャッシュを取得できた場合は即検索を実行
if (cacheFormData !== null) {
  fetch()
}

const childTargetName = computed(() => {
  switch (showUnitType.value) {
    case SkuMonitoringUnitTypes.Group:
      return '中分類'
    case SkuMonitoringUnitTypes.Department:
      return '小分類'
    case SkuMonitoringUnitTypes.Line:
      return '細分類'
    case SkuMonitoringUnitTypes.Class:
      return 'ＳＫＵ'
    default:
      return null
  }
})

async function showChild(targetId: string, storeId: string) {
  const children = await apiEffectivenessFetchChildTarget({
    targetUnitType: showUnitType.value,
    targetId,
    storeId,
  })
  const stores = selectedStores.value.filter(
    (store) => store.storeId === storeId
  )

  switch (showUnitType.value) {
    case SkuMonitoringUnitTypes.Group:
      frontCacheSet(
        'effectivenessFormData',
        {
          skuMonitoringUnitType: SkuMonitoringUnitTypes.Department,
          from: from.value,
          to: to.value,
          stores,
          departments: children,
        },
        true
      )
      break
    case SkuMonitoringUnitTypes.Department:
      frontCacheSet(
        'effectivenessFormData',
        {
          skuMonitoringUnitType: SkuMonitoringUnitTypes.Line,
          from: from.value,
          to: to.value,
          stores,
          lines: children,
        },
        true
      )
      break
    case SkuMonitoringUnitTypes.Line:
      frontCacheSet(
        'effectivenessFormData',
        {
          skuMonitoringUnitType: SkuMonitoringUnitTypes.Class,
          from: from.value,
          to: to.value,
          stores,
          classes: children,
        },
        true
      )
      break
    case SkuMonitoringUnitTypes.Class:
      frontCacheSet(
        'effectivenessFormData',
        {
          skuMonitoringUnitType: SkuMonitoringUnitTypes.Sku,
          from: from.value,
          to: to.value,
          stores,
          skus: children,
        },
        true
      )
      break
  }

  // 検索した情報を別タブで開く
  window.open('/effectiveness', '_blank')
}
</script>

<style scoped></style>
