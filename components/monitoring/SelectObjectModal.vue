<template>
  <UModal v-model="isOpenModal">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <UForm :state="{}" class="flex flex-row" @submit="fetch(1)">
          <UInput
            v-model="searchRequest.text"
            class="basis-10/12"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="検索"
          />
          <div class="basis-2/12 text-right">
            <UButton color="indigo" @click="fetch(1)"> 検索 </UButton>
          </div>
        </UForm>
      </template>

      <UTable
        v-model="internalSelected"
        :rows="items"
        :columns="columns"
        @select="onSelected"
      />
      <template #footer>
        <div class="flex flex-row">
          <div class="basis-3/4 justify-start">
            <UPagination
              v-model="searchRequest.page"
              :page-count="searchRequest.perPage"
              :max="5"
              :total="total"
              @change="fetch(searchRequest.page)"
            />
          </div>
          <div class="basis-1/4 text-right">
            <UButton color="gray" label="閉じる" @click="isOpenModal = false" />
            <UButton color="primary" class="ml-2" label="保存" @click="save" />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import type { PaginationRequest } from '~/types/interfaces/common/Pagination'
import PaginationRequestFactory from '~/types/interfaces/common/PaginationRequestFactory'

const isOpenModal = defineModel('isOpenModal', {
  type: Boolean,
  required: true,
})
const { columns } = withDefaults(
  defineProps<{
    columns: { key: string; label: string }[]
    nameColumn: string
  }>(),
  {}
)
const items = defineModel<any[]>('items', {
  type: Array,
  required: true,
})
const total = defineModel<number>('total', {
  type: Number,
  required: true,
})
const selected = defineModel<any[]>('selected', {
  type: Array,
  required: true,
})
const internalSelected = ref<any>([])

interface SearchRequest extends PaginationRequest {
  text: string | null
}
const searchRequest = ref<SearchRequest>({
  text: null,
  ...new PaginationRequestFactory(),
})
const emit = defineEmits<{ fetchItems: [searchRequest: SearchRequest] }>()

watch(isOpenModal, async (value) => {
  if (value) {
    total.value = 0
    items.value = []
    searchRequest.value = {
      text: null,
      page: 1,
      perPage: searchRequest.value.perPage,
    }
    internalSelected.value = [...selected.value]
    await emit('fetchItems', searchRequest.value)
  }
})

const page = computed(() => searchRequest.value.page)
watch(page, (value) => {
  fetch(value)
})

function save() {
  selected.value = [...internalSelected.value]
  isOpenModal.value = false
}

function fetch(page: number) {
  searchRequest.value.page = page
  emit('fetchItems', searchRequest.value)
}

function onSelected(row: any) {
  if (!internalSelected.value.includes(row)) {
    internalSelected.value.push(row)
  } else {
    internalSelected.value.splice(internalSelected.value.indexOf(row), 1)
  }
}
</script>

<style scoped>
/* ボタンを改行させないようにする */
.select-buttons > :deep(span) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
