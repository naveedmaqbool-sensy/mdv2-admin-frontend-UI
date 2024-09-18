<template>
  <UModal
    id="detail-modal"
    v-model="isOpenModal"
    :ui="{ width: 'w-full sm:max-w-7xl' }"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <UForm :state="{}" class="flex flex-row" @submit="fetchItems">
          <h1 class="basis-2/12 text-lg font-bold">{{ headerTitle }}</h1>
          <div class="basis-10/12 text-right">
            <UInput
              v-model="searchText"
              icon="i-heroicons-magnifying-glass-20-solid"
              class="inline-block w-1/4"
              placeholder="検索"
            />
            <UButton color="indigo" class="ml-2" @click="fetchItems">
              検索
            </UButton>
          </div>
        </UForm>
      </template>
      <UTable :rows="items" :columns="headers" />

      <template #footer>
        <div class="flex flex-row">
          <div class="basis-3/4 justify-start">
            <UPagination
              v-model="page"
              :page-count="perPage"
              :max="5"
              :total="total"
            />
          </div>
          <div class="basis-1/4 text-right">
            <UButton color="gray" label="閉じる" @click="isOpenModal = false" />
            <UButton
              color="primary"
              class="ml-2"
              label="CSV出力"
              @click="emit('csv-export')"
            />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import MonitoringTypes from '~/types/enums/MonitoringTypes'

const isOpenModal = defineModel('isOpenModal', {
  type: Boolean,
  required: true,
})
const page = defineModel('page', {
  type: Number,
  required: true,
})
const searchText = defineModel('searchText', {
  type: String,
  required: true,
})

const props = defineProps<{
  items: any[]
  total: number
  monitoringType: MonitoringTypes
}>()

const perPage = defineModel('perPage', {
  type: Number,
  required: true,
})

const headerTitle = computed(() => {
  // FIXME: rfukuma 種類に応じたタイトル
  switch (props.monitoringType) {
    case MonitoringTypes.OrderChangePty:
      return '発注修正数明細'
    case MonitoringTypes.OrderChangeRate:
      return '発注修正率明細'
    default:
      return ''
  }
})
const headers = computed(() => {
  // FIXME: rfukuma 種類に応じたヘッダー
  switch (props.monitoringType) {
    case MonitoringTypes.OrderChangePty:
    case MonitoringTypes.OrderChangeRate:
      return [
        {
          key: 'date',
          label: '日付',
        },
        {
          key: 'storeId',
          label: '店舗ID',
        },
        {
          key: 'storeName',
          label: '店舗名称',
        },
        {
          key: 'departmentName',
          label: '中分類',
        },
        {
          key: 'skuId',
          label: 'SKU ID',
        },
        {
          key: 'skuName',
          label: '商品名称',
        },
        {
          key: 'recommendedOrderQty',
          label: '発注推奨数',
        },
        {
          key: 'actualOrderQty',
          label: '発注数',
        },
        {
          key: 'differenceOrderQty',
          label: '差異',
        },
      ]
    default:
      return []
  }
})

// ページ切り替え時に再読み込み
const emit = defineEmits(['fetch-items', 'csv-export'])
watch(page, () => {
  emit('fetch-items')
})

function fetchItems() {
  if (page.value !== 1) {
    page.value = 1
    return
  }
  emit('fetch-items')
}
</script>

<style scoped>
:deep(table > tbody > tr > td) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

:deep(table > thead > tr > th) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
