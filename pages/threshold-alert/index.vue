<template>
  <div class="space-y-6">
    <CommonHeader title="閾値アラートリスト" />

    <!-- Filter Bar -->
    <UCard :ui="{ ring: 'ring-1 ring-gray-200', shadow: 'shadow-sm' }">
      <UForm :state="{}" @submit="get(request.page)">
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <div class="flex items-center gap-4">
            <label class="whitespace-nowrap text-sm font-bold text-gray-700">
              検索対象期間
            </label>
            <div class="w-40">
              <CommonDatepicker v-model="request.from" />
            </div>
            <span class="text-gray-400">～</span>
            <div class="w-40">
              <CommonDatepicker v-model="request.to" />
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 md:ml-auto md:border-t-0 md:pt-0"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              @click="reset"
              >リセット</UButton
            >
            <UButton
              color="indigo"
              icon="i-heroicons-magnifying-glass"
              @click="get(request.page)"
              >検索する</UButton
            >
          </div>
        </div>
      </UForm>
    </UCard>

    <!-- Data Table -->
    <UCard
      :ui="{
        ring: 'ring-1 ring-gray-200',
        shadow: 'shadow-sm',
        body: { padding: 'p-0 sm:p-0' },
      }"
    >
      <UTable
        :rows="thresholdAlerts"
        :columns="thresholdAlertHeaders"
        class="w-full"
      >
        <template #objectiveDate-data="{ row }">
          <span class="font-medium text-gray-700">{{
            formatterDate(row.objectiveDate)
          }}</span>
        </template>
        <template #monitoringType-data="{ row }">
          <UBadge color="red" variant="subtle" size="sm">
            {{ MonitoringTypes.getName(row.monitoringType) }}
          </UBadge>
        </template>
        <template #skuMonitoringUnitType-data="{ row }">
          <span class="text-gray-800">{{ skuTarget(row) }}</span>
        </template>
        <template #storeMonitoringUnitType-data="{ row }">
          <span class="text-gray-800">{{ storeTarget(row) }}</span>
        </template>
        <template #actions-data="{ row }">
          <UButton
            color="white"
            variant="solid"
            size="xs"
            icon="i-heroicons-eye"
            @click="openTargetModal(row)"
          >
            対象を確認
          </UButton>
        </template>
      </UTable>

      <!-- Pagination Footer -->
      <div
        v-if="thresholdAlertTotal > 0"
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500">
          全 {{ formatterNumber(thresholdAlertTotal) }} 件のご確認
        </span>
        <UPagination
          v-model="paginationPage"
          :page-count="request.perPage"
          :max="5"
          :total="thresholdAlertTotal"
        />
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        該当する閾値アラートは見つかりませんでした。
      </div>
    </UCard>

    <div class="pt-4">
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="back"
        >ダッシュボードへ戻る</UButton
      >
    </div>

    <!-- Target Details Modal -->
    <UModal v-model="showTargetModal">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">対象詳細の確認</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              class="-my-1"
              @click="showTargetModal = false"
            />
          </div>
        </template>

        <UTabs
          :items="[{ label: '対象アイテム' }, { label: '対象店舗' }]"
          class="mb-4"
          @change="onChangedTarget"
        />

        <UTable :rows="targets" :columns="[{ key: 'name', label: '登録名称' }]">
          <template #name-data="{ row }">
            <span class="font-medium text-gray-700">{{ row?.targetName }}</span>
          </template>
        </UTable>

        <template #footer>
          <div class="flex flex-row items-center justify-between">
            <UPagination
              v-model="targetPaginationPage"
              :page-count="targetFetchRequst.perPage"
              :max="5"
              :total="targetTotal"
            />
            <UButton
              color="gray"
              variant="solid"
              label="閉じる"
              @click="showTargetModal = false"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ThresholdAlertFetchRequestFactory } from '~/composables/api/thresholdAlert/Fetch'
import AppStateTypes from '~/types/enums/AppStateTypes'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type AdminAlert from '~/types/interfaces/database/AdminAlert'
import type AdminAlertTarget from '~/types/interfaces/database/AdminAlertTarget'
import type AlertFormData from '~/types/interfaces/page/alert/FormData'
import AlertFormDataFactory from '~/types/interfaces/page/alert/FormDataFactory'

const formData =
  servicePersistentStateGet<AlertFormData>(AppStateTypes.AlertFormData, {
    from: (value: string | null) => (value ? new Date(value) : null),
    to: (value: string | null) => (value ? new Date(value) : null),
  }) || new AlertFormDataFactory()
const request = ref({
  ...new ThresholdAlertFetchRequestFactory(),
  from: formData.from,
  to: formData.to,
})
const paginationPage = computed({
  get: () => request.value.page,
  set: (value) => {
    get(value)
  },
})
const thresholdAlerts = ref<AdminAlert[]>([])
const thresholdAlertTotal = ref(0)
const thresholdAlertHeaders = [
  {
    key: 'objectiveDate',
    label: '対象日',
  },
  {
    key: 'monitoringType',
    label: 'アラート種類',
  },
  {
    key: 'threshold',
    label: '閾値',
  },
  {
    key: 'skuMonitoringUnitType',
    label: '対象単位',
  },
  {
    key: 'storeMonitoringUnitType',
    label: '対象店舗',
  },
  {
    key: 'targetDetail',
    label: '操作',
  },
]

async function reset() {
  request.value = new ThresholdAlertFetchRequestFactory()
  await get(1)
}

async function get(page: number) {
  request.value.page = page
  serviceLoadingStart()
  const response = await apiThresholdAlertFetch(request.value)
  serviceLoadingFinish()
  if (!response) {
    return
  }

  thresholdAlerts.value = response.data
  thresholdAlertTotal.value = response.total

  // 検索条件をブラウザに保持する
  servicePersistentStateSet(AppStateTypes.AlertFormData, request.value)
}
await get(1)

function back() {
  useRouter().back()
}

function skuTarget(adminAlert: AdminAlert) {
  switch (adminAlert.skuMonitoringUnitType) {
    case SkuMonitoringUnitTypes.Sku:
      return (
        adminAlert.adminAlertTargets?.filter((v) => v.skuId).length +
        ' 件の商品'
      )
    case SkuMonitoringUnitTypes.Group:
      return (
        adminAlert.adminAlertTargets?.filter((v) => v.groupId).length +
        ' 件の部門'
      )
    case SkuMonitoringUnitTypes.Department:
      return (
        adminAlert.adminAlertTargets?.filter((v) => v.departmentId).length +
        ' 件の中分類'
      )
    case SkuMonitoringUnitTypes.Line:
      return (
        adminAlert.adminAlertTargets?.filter((v) => v.lineId).length +
        ' 件の小分類'
      )
    case SkuMonitoringUnitTypes.Class:
      return (
        adminAlert.adminAlertTargets?.filter((v) => v.classId).length +
        ' 件の細分類'
      )
  }
}

function storeTarget(adminAlert: AdminAlert) {
  switch (adminAlert.storeMonitoringUnitType) {
    case StoreMonitoringUnitTypes.All:
      return '全店舗'
    case StoreMonitoringUnitTypes.Store:
      return (
        adminAlert.adminAlertTargets?.filter((v) => v.storeId).length +
        ' 件の店舗'
      )
  }
}

// 対象を確認するモーダル関連の処理 -------------------------------------------------------------
const showTargetModal = ref(false)
const targetFetchRequst = ref(new ThresholdAlertTargetFetchRequestFactory())
const targetPaginationPage = computed({
  get: () => targetFetchRequst.value.page,
  set: (value) => {
    targetFetch(value)
  },
})
const targets = ref<AdminAlertTarget[]>([])
const targetTotal = ref(0)
async function openTargetModal(adminAlert: AdminAlert) {
  targetFetchRequst.value = new ThresholdAlertTargetFetchRequestFactory(
    adminAlert.id
  )

  const result = await targetFetch(1)

  // 正常に取得できていたらモーダルを展開
  if (result) {
    showTargetModal.value = true
  }
}

async function targetFetch(page: number) {
  targetFetchRequst.value.page = page

  serviceLoadingStart()
  const response = await apiThresholdAlertTargetFetch(targetFetchRequst.value)
  serviceLoadingFinish()

  if (!response) {
    return false
  }

  targets.value = response.data
  targetTotal.value = response.total
  return true
}

function onChangedTarget(index: number) {
  targetFetchRequst.value.isStore = index === 1

  targetFetch(1)
}
// -------------------------------------------------------------------------------------------
</script>

<style scoped></style>
