<template>
  <div class="space-y-6">
    <CommonHeader title="在庫アラートリスト" />

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
              @click="reset"
              icon="i-heroicons-arrow-path"
              >リセット</UButton
            >
            <UButton
              color="indigo"
              @click="get(request.page)"
              icon="i-heroicons-magnifying-glass"
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
      <UTable :rows="stockAlerts" :columns="stockAlertHeaders" class="w-full">
        <template #date-data="{ row }">
          <span class="font-medium text-gray-700">{{
            formatterDate(row.date)
          }}</span>
        </template>
        <template #storeId-data="{ row }">
          {{ row.storeSkuMaster?.storeMaster?.storeName ?? row.storeId }}
        </template>
        <template #skuId-data="{ row }">
          <span class="font-medium text-gray-900">{{
            row.storeSkuMaster?.skuName ?? row.skuId
          }}</span>
        </template>
        <template #skuAlertType-data="{ row }">
          <UBadge color="red" variant="subtle" size="sm">
            {{ SkuAlertTypes.getName(row.skuAlertType) }}
          </UBadge>
        </template>
      </UTable>

      <!-- Pagination Footer -->
      <div
        v-if="stockAlertTotal > 0"
        class="flex items-center justify-between rounded-b-lg border-t border-gray-100 bg-gray-50/50 p-4"
      >
        <span class="text-sm text-gray-500">
          全 {{ formatterNumber(stockAlertTotal) }} 件のご確認
        </span>
        <UPagination
          v-model="paginationPage"
          :page-count="request.perPage"
          :max="5"
          :total="stockAlertTotal"
        />
      </div>
      <div v-else class="p-8 text-center text-gray-500">
        該当する在庫アラートは見つかりませんでした。
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
  </div>
</template>

<script setup lang="ts">
import AppStateTypes from '~/types/enums/AppStateTypes'
import SkuAlertTypes from '~/types/enums/SkuAlertTypes'
import type SkuAlert from '~/types/interfaces/database/SkuAlert'
import type AlertFormData from '~/types/interfaces/page/alert/FormData'
import AlertFormDataFactory from '~/types/interfaces/page/alert/FormDataFactory'

const formData =
  servicePersistentStateGet<AlertFormData>(AppStateTypes.AlertFormData, {
    from: (value: string | null) => (value ? new Date(value) : null),
    to: (value: string | null) => (value ? new Date(value) : null),
  }) || new AlertFormDataFactory()
const request = ref({
  ...new StockAlertFetchRequestFactory(),
  from: formData.from,
  to: formData.to,
})
const paginationPage = computed({
  get: () => request.value.page,
  set: (value) => {
    get(value)
  },
})
const stockAlerts = ref<SkuAlert[]>([])
const stockAlertTotal = ref(0)
const stockAlertHeaders = [
  {
    key: 'date',
    label: '対象日',
  },
  {
    key: 'storeId',
    label: '店舗',
  },
  {
    key: 'skuId',
    label: 'SKU',
  },
  {
    key: 'skuAlertType',
    label: '種類',
  },
]

async function reset() {
  request.value = new StockAlertFetchRequestFactory()
  await get(1)
}

async function get(page: number) {
  request.value.page = page
  serviceLoadingStart()
  const response = await apiStockAlertFetch(request.value)
  serviceLoadingFinish()
  if (!response) {
    return
  }

  stockAlerts.value = response.data
  stockAlertTotal.value = response.total

  // 検索条件をブラウザに保持する
  servicePersistentStateSet<AlertFormData>(AppStateTypes.AlertFormData, {
    from: formData.from,
    to: formData.to,
  })
}
await get(1)

function back() {
  useRouter().back()
}
</script>

<style scoped></style>
