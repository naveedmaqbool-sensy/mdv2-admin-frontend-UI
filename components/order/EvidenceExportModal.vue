<template>
  <UModal
    id="detail-modal"
    v-model="isOpenModal"
    :ui="{ width: 'w-full sm:max-w-xl' }"
  >
    <UCard
      :ui="{
        ring: '',
      }"
    >
      <template #header>
        <h1 class="text-lg font-bold">発注推奨数エビデンス出力</h1>
      </template>
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <div class="my-auto basis-1/12 text-right">
            <label class="whitespace-nowrap pr-2 text-right font-bold">
              対象期間
            </label>
          </div>
          <div class="basis-3/12">
            <CommonDatepicker v-model="from" />
          </div>
          <div class="my-auto px-2">～</div>
          <div class="basis-3/12">
            <CommonDatepicker v-model="to" />
          </div>
        </div>

        <!-- 対象商品 -->
        <div class="flex flex-row pt-2">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold">対象商品</label>
          </div>
          <div class="flex flex-col justify-center whitespace-nowrap pl-2">
            <UButton color="indigo" @click="openSkuModal">選択</UButton>
          </div>
        </div>
        <div
          v-if="apiValidationError?.exists('selectedSkus')"
          class="flex flex-row"
        >
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('selectedSkus') }}
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
        </div>

        <!-- 対象店舗 -->
        <div class="flex flex-row pt-2">
          <div class="flex basis-1/12 flex-col justify-center text-right">
            <label class="whitespace-nowrap pr-2 font-bold"> 対象店舗 </label>
          </div>
          <div class="flex flex-col justify-center whitespace-nowrap pl-2">
            <UButton color="indigo" @click="openStoreModal">選択</UButton>
          </div>
        </div>
        <div
          v-if="apiValidationError?.exists('selectedStores')"
          class="flex flex-row"
        >
          <div class="flex basis-1/12 flex-col justify-center text-right" />
          <div class="text-red-400">
            {{ apiValidationError?.first('selectedStores') }}
          </div>
        </div>
        <div class="flex flex-row pt-2">
          <div v-if="selectedStores.length > 0" class="pb-3">
            <template
              v-for="(store, index) in selectedStores"
              :key="store.storeId"
            >
              <UBadge class="ml-1" color="gray">
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
      </section>
      <template #footer>
        <div class="flex flex-row">
          <div class="basis-3/4 justify-start"></div>
          <div class="basis-1/4 text-right">
            <UButton color="gray" label="閉じる" @click="isOpenModal = false" />
            <UButton
              color="primary"
              class="ml-2"
              label="出力"
              @click="onSubmit"
            />
          </div>
        </div>
      </template>
    </UCard>

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
        { key: 'skuName', label: '商品名' },
      ]"
      id-column-name="skuId"
      is-radio
      @fetch-items="fetchSkus"
    />

    <MonitoringSelectObjectModal
      v-model:is-open-modal="isOpenStoreModal"
      v-model:selected="selectedStores"
      v-model:items="stores"
      v-model:total="itemsTotal"
      :columns="[{ key: 'storeName', label: '店舗' }]"
      id-column-name="storeId"
      is-radio
      @fetch-items="fetchStores"
    />
  </UModal>
</template>

<script setup lang="ts">
import type ApiValidationError from '~/types/classes/ApiValidationError'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

const emit = defineEmits<{
  submit: [
    {
      from: Date
      to: Date
      sku: any
      store: StoreMaster
    },
  ]
}>()

const isOpenModal = defineModel('isOpenModal', {
  type: Boolean,
  required: true,
})

const props = withDefaults(
  defineProps<{
    targetDateFrom: Date | null
    targetDateTo: Date | null
    selectedSkus: any[]
    selectedStores: StoreMaster[]
  }>(),
  {}
)

const from = ref<Date | null>(props.targetDateFrom)
const to = ref<Date | null>(props.targetDateTo)
const skus = ref<any[]>([])
const selectedSkus = ref<any[]>(JSON.parse(JSON.stringify(props.selectedSkus)))
const stores = ref<StoreMaster[]>([])
const selectedStores = ref<StoreMaster[]>(
  JSON.parse(JSON.stringify(props.selectedStores))
)
const itemsTotal = ref(0)

watch(isOpenModal, (newVal, _oldVal) => {
  // 登録されているエラーを初期化
  apiValidationError.value.refresh()

  // モーダル開いたときに初期値入力
  if (newVal) {
    nextTick(() => {
      from.value = props.targetDateFrom
      to.value = props.targetDateTo
      selectedSkus.value = JSON.parse(JSON.stringify(props.selectedSkus))
      selectedStores.value = JSON.parse(JSON.stringify(props.selectedStores))
    })
  }
})

const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)

const isOpenSkuModal = ref(false)
function openSkuModal() {
  isOpenSkuModal.value = true
  apiValidationError.value.refresh()
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

function onSubmit() {
  apiValidationError.value.refresh()

  if (!from.value) {
    apiValidationError.value.set('from', '対象期間を指定してください。')
  }

  if (!to.value) {
    apiValidationError.value.set('to', '対象期間を指定してください。')
  }

  if (selectedSkus.value.length === 0) {
    apiValidationError.value.set('selectedSkus', '対象商品を指定してください。')
  } else if (selectedSkus.value.length > 1) {
    apiValidationError.value.set(
      'selectedSkus',
      '対象商品を1つに絞り込んでください。'
    )
  }

  if (selectedStores.value.length === 0) {
    apiValidationError.value.set(
      'selectedStores',
      '対象店舗を指定してください。'
    )
  } else if (selectedStores.value.length > 1) {
    apiValidationError.value.set(
      'selectedStores',
      '対象店舗を1つに絞り込んでください。'
    )
  }

  // エラーがある場合は処理しない
  if (apiValidationError.value.exists()) {
    return
  }

  // 処理する
  emit('submit', {
    from: from.value!,
    to: to.value!,
    sku: selectedSkus.value[0],
    store: selectedStores.value[0],
  })
}
</script>
