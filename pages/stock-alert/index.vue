<template>
  <div>
    <CommonHeader title="在庫アラート" />

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
        <UButton class="ml-2" color="indigo" @click="get(request.page)">
          確認
        </UButton>
      </section>
    </UForm>

    <UTable :rows="stockAlerts" :columns="stockAlertHeaders">
      <template #date-data="{ row }">
        {{ formatterDate(row.date) }}
      </template>
      <template #storeId-data="{ row }">
        {{ row.storeSkuMaster?.storeMaster?.storeName ?? row.storeId }}
      </template>
      <template #skuId-data="{ row }">
        {{ row.storeSkuMaster?.skuName ?? row.skuId }}
      </template>
      <template #skuAlertType-data="{ row }">
        {{ SkuAlertTypes.getName(row.skuAlertType) }}
      </template>
    </UTable>
    <UPagination
      v-model="paginationPage"
      :page-count="request.perPage"
      :max="5"
      :total="stockAlertTotal"
    />

    <div class="pt-2">
      <UButton color="white" @click="back">戻る</UButton>
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
