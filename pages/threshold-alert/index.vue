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
        {{ SkuMonitoringUnitTypes.getName(row.skuMonitoringUnitType) }}
      </template>
      <template #storeMonitoringUnitType-data="{ row }">
        {{ StoreMonitoringUnitTypes.getName(row.storeMonitoringUnitType) }}
      </template>
      <template #actions-data="{ row }">
        <UButton color="blue" @click="gotoConfig(row)">対象を確認</UButton>
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
  </div>
</template>

<script setup lang="ts">
import { ThresholdAlertFetchRequestFactory } from '~/composables/api/thresholdAlert/Fetch'
import AppStateTypes from '~/types/enums/AppStateTypes'
import MonitoringTypes from '~/types/enums/MonitoringTypes'
import SkuMonitoringUnitTypes from '~/types/enums/SkuMonitoringUnitTypes'
import StoreMonitoringUnitTypes from '~/types/enums/StoreMonitoringUnitTypes'
import type AdminAlert from '~/types/interfaces/database/AdminAlert'
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

function gotoConfig(adminAlert: AdminAlert) {
  useRouter().push('/config/' + adminAlert.adminAlertThresholdId)
}
</script>

<style scoped></style>
