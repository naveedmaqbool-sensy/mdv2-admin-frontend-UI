<template>
  <div>
    <CommonHeader title="閾値アラート" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <div class="my-auto basis-1/12">
            <label class="whitespace-nowrap pr-2 text-right font-bold">
              対象期間
            </label>
          </div>
          <div class="basis-2/12">
            <CommonDatepicker v-model="request.from" />
          </div>
          <div class="my-auto px-2">～</div>
          <div class="basis-2/12">
            <CommonDatepicker v-model="request.to" />
          </div>
        </div>
      </section>
      <section class="pt-2">
        <UButton color="white" @click="reset">リセット</UButton>
        <UButton class="ml-2" color="indigo" @click="get">確認</UButton>
      </section>
    </UForm>

    <UTable :rows="thresholdAlerts" :columns="thresholdAlertHeaders">
      <template #objectiveDate-data="{ row }">
        {{ formatterDate(row.objectiveDate) }}
      </template>
      <template #monitoringType-data="{ row }">
        {{ MonitoringTypes.getName(row.monitoringType) }}
      </template>
      <template #skuMonitoringUnitType-data="{ row }">
        {{ skuTarget(row) }}
      </template>
      <template #storeMonitoringUnitType-data="{ row }">
        {{ storeTarget(row) }}
      </template>
      <template #actions-data="{ row }">
        <UButton color="blue" @click="openTargetModal(row)">対象を確認</UButton>
      </template>
    </UTable>
    <UPagination
      v-model="request.page"
      :page-count="request.perPage"
      :max="5"
      :total="thresholdAlertTotal"
      @change="get(request.page)"
    />

    <div class="pt-2">
      <UButton color="white" @click="back">戻る</UButton>
    </div>

    <UModal v-model="showTargetModal">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <!-- <UForm :state="{}" class="flex flex-row" @submit="fetch(1)">
            <UInput
              v-model="searchRequest.text"
              class="basis-10/12"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="検索"
            />
            <div class="basis-2/12 text-right">
              <UButton color="indigo" @click="fetch(1)"> 検索 </UButton>
            </div>
          </UForm> -->
        </template>

        <UTabs
          :items="[
            {
              label: '対象',
            },
            { label: '店舗' },
          ]"
          @change="onChangedTarget"
        />

        <UTable
          :rows="targets"
          :columns="[
            {
              key: 'name',
              label: '名前',
            },
          ]"
        >
          <template #name-data="{ row }">
            {{ row?.targetName }}
          </template>
        </UTable>

        <template #footer>
          <div class="flex flex-row">
            <div class="basis-3/4 justify-start">
              <UPagination
                v-model="targetFetchRequst.page"
                :page-count="targetFetchRequst.perPage"
                :max="5"
                :total="targetTotal"
                @change="targetFetch(targetFetchRequst.page)"
              />
            </div>
            <div class="basis-1/4 text-right">
              <UButton
                color="gray"
                label="閉じる"
                @click="showTargetModal = false"
              />
            </div>
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
import type FormData from '~/types/interfaces/page/alert/FormData'
import FormDataFactory from '~/types/interfaces/page/alert/FormDataFactory'

const formData =
  servicePersistentStateGet<FormData>(AppStateTypes.AlertFormData, {
    from: (value: string | null) => (value ? new Date(value) : null),
    to: (value: string | null) => (value ? new Date(value) : null),
  }) || new FormDataFactory()
const request = ref({
  ...new ThresholdAlertFetchRequestFactory(),
  from: formData.from,
  to: formData.to,
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
    label: '項目',
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
    key: 'actions',
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
        ' 件の種別'
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
