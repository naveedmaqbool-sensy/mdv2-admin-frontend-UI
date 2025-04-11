<template>
  <div>
    <CommonHeader title="発注条件マスタ 一括更新履歴" />
    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">更新登録日</label>
          </div>
          <div class="my-auto flex basis-2/12 flex-col justify-center">
            <CommonDatepicker v-model="formData.uploadedDate" />
          </div>
        </div>
        <div class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">作業者</label>
          </div>
          <div class="my-auto flex basis-2/12 flex-col justify-center">
            <CommonInput v-model="formData.userNameText" type="text" />
          </div>
        </div>
        <div class="flex flex-row">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">更新エラー</label>
          </div>
          <div class="my-auto flex basis-2/12 flex-col justify-center">
            <UCheckbox v-model="formData.hasError" label="エラーを含む" />
          </div>
        </div>
      </section>
      <section class="pt-2">
        <UButton color="white" @click="reset">リセット</UButton>
        <UButton class="ml-2" color="indigo" @click="fetch(1)"> 検索 </UButton>
      </section>
    </UForm>

    <UTable :rows="histories" :columns="columns">
      <template #createdAt-data="{ row }">
        {{ formatterDateTime(row.createdAt) }}
      </template>
      <template #userName-data="{ row }">
        {{ row.user?.name }}
      </template>
      <template #values-data="{ row }">
        <UButton variant="link" color="indigo" @click="showValues(row)">
          更新内容
        </UButton>
      </template>
      <template #targetSku-data="{ row }">
        <template
          v-if="row.skuUnitType === OrderConditionsUpsertUnitTypes.Single"
        >
          {{
            row.targets
              .map((v: OrderConditionsMasterImportTarget) => v.skuId)
              .join(', ')
          }}
        </template>
        <UButton
          v-else
          variant="link"
          color="indigo"
          @click="downloadSkuFile(row)"
        >
          CSV
        </UButton>
      </template>
      <template #targetStore-data="{ row }">
        <template
          v-if="row.storeUnitType === OrderConditionsUpsertStoreUnitTypes.All"
        >
          全店一律
        </template>
        <UButton
          v-else
          variant="link"
          color="indigo"
          @click="downloadStoreFile(row)"
        >
          CSV
        </UButton>
      </template>
      <template #errorFile-data="{ row }">
        <template v-if="!row.hasErrorFile">-</template>
        <UButton
          v-else
          variant="link"
          color="indigo"
          @click="downloadErrorFile(row)"
        >
          CSV
        </UButton>
      </template>
      <template #statusType-data="{ row }">
        {{ OrderConditionsStatusTypes.getName(row.statusType) }}
      </template>
    </UTable>

    <UPagination
      v-model="paginationPage"
      :page-count="formData.perPage"
      :max="5"
      :total="total"
    />
  </div>
</template>

<script setup lang="ts">
import OrderConditionsStatusTypes from '~/types/enums/OrderConditionsStatusTypes'
import OrderConditionsUpsertStoreUnitTypes from '~/types/enums/OrderConditionsUpsertStoreUnitTypes'
import OrderConditionsUpsertUnitTypes from '~/types/enums/OrderConditionsUpsertUnitTypes'
import type OrderConditionsMasterImport from '~/types/interfaces/database/OrderConditionsMasterImport'
import type OrderConditionsMasterImportTarget from '~/types/interfaces/database/OrderConditionsMasterImportTarget'

const formData = ref(new OrderConditionsHistoryFetchRequestFactory())
const apiValidationError = ref(serviceValidationErrorsInstance())
const histories = ref<OrderConditionsMasterImport[]>([])
const total = ref(0)

function reset() {
  formData.value = new OrderConditionsHistoryFetchRequestFactory()
}

async function fetch(page?: number) {
  formData.value.page = page ?? formData.value.page
  serviceLoadingStart()
  const response = await apiOrderConditionsHistoryFetch(formData.value)
  serviceLoadingFinish()

  apiValidationError.value.refresh()

  if (!response) {
    return
  }

  histories.value = response.data
  total.value = response.total
}

await fetch()

const paginationPage = computed({
  get: () => formData.value.page,
  set: (value) => {
    fetch(value)
  },
})

const columns = [
  {
    key: 'createdAt',
    label: '登録日',
  },
  {
    key: 'userName',
    label: '作業者',
  },
  {
    key: 'values',
    label: '更新内容',
  },
  {
    key: 'targetSku',
    label: '対象SKU',
  },
  {
    key: 'targetStore',
    label: '対象店舗',
  },
  {
    key: 'errorFile',
    label: '更新エラー',
  },
  {
    key: 'statusType',
    label: '状態',
  },
]

async function downloadSkuFile(history: OrderConditionsMasterImport) {
  serviceLoadingStart()
  const response = await apiOrderConditionsHistoryTargetSkuDownload({
    id: history.id,
  })

  if (!response) {
    serviceLoadingFinish()
    return
  }

  const downloadUrl = response.downloadUrl
  await apiDownloadStorageBySignedUrl(downloadUrl, '対象SKU.csv')
  serviceLoadingFinish()
}

async function downloadStoreFile(history: OrderConditionsMasterImport) {
  serviceLoadingStart()
  const response = await apiOrderConditionsHistoryTargetStoreDownload({
    id: history.id,
  })

  if (!response) {
    serviceLoadingFinish()
    return
  }

  const downloadUrls = response.downloadUrls
  await Promise.all(
    downloadUrls.map((downloadUrl, index) =>
      apiDownloadStorageBySignedUrl(downloadUrl, `対象店舗${index + 1}.csv`)
    )
  )
  serviceLoadingFinish()
}

async function downloadErrorFile(history: OrderConditionsMasterImport) {
  serviceLoadingStart()
  const response = await apiOrderConditionsHistoryErrorDownload({
    id: history.id,
  })

  if (!response) {
    serviceLoadingFinish()
    return
  }

  const downloadUrl = response.downloadUrl
  await apiDownloadStorageBySignedUrl(downloadUrl, 'エラー内容.csv')
  serviceLoadingFinish()
}

async function showValues(history: OrderConditionsMasterImport) {
  // レコードとして保存しているのでＡＰＩから１ファイルずつ直接ダウロードする
  serviceLoadingStart()
  await apiOrderConditionsHistoryValueDownload({
    id: history.id,
    fileName: '変更内容.csv',
  })
  serviceLoadingFinish()
}
</script>

<style scoped></style>
