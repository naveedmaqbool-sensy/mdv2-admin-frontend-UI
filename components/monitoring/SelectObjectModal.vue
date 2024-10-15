<template>
  <UModal v-model="isOpenModal">
    <UCard
      :ui="{
        ring: '',
      }"
    >
      <template #header>
        <UForm :state="{}" class="flex flex-row" @submit="fetch(1)">
          <UInput
            v-model="searchRequest.text"
            class="basis-11/12"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="検索"
          />
          <div class="basis-1/12 text-right">
            <UButton color="indigo" @click="fetch(1)"> 検索 </UButton>
          </div>
        </UForm>
      </template>

      <UTable :rows="items" :columns="headers" @select="onSelected">
        <template #selected-data="{ row }">
          <UCheckbox
            :model-value="
              internalSelected.findIndex(
                (v) => v[idColumnName] === row[idColumnName]
              ) >= 0
            "
          />
        </template>
        <template #selected-header>
          <UCheckbox v-model="allSelected" />
        </template>
      </UTable>

      <template #footer>
        <div class="flex flex-row">
          <div class="basis-3/4 justify-start">
            <UPagination
              v-model="paginationPage"
              :page-count="searchRequest.perPage"
              :max="5"
              :total="total"
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
const { columns, idColumnName } = withDefaults(
  defineProps<{
    columns: { key: string; label: string }[]
    idColumnName: string
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

const internalSelected = ref<any[]>([])

interface SearchRequest extends PaginationRequest {
  text: string | null
}
const searchRequest = ref<SearchRequest>({
  text: null,
  ...new PaginationRequestFactory(),
})
const paginationPage = computed({
  get: () => searchRequest.value.page,
  set: (value) => {
    fetch(value)
  },
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
  const index = internalSelected.value.findIndex(
    (v) => v[idColumnName] === row[idColumnName]
  )
  if (index < 0) {
    internalSelected.value.push(row)
  } else {
    internalSelected.value.splice(index, 1)
  }
}

const headers = computed(() => {
  return [{ key: 'selected', label: '選択' }, ...columns]
})

const allSelected = computed({
  get: () => {
    return items.value.every((v) => {
      return internalSelected.value.includes(v)
    })
  },
  set: (value) => {
    items.value.forEach((v) => {
      const index = internalSelected.value.findIndex(
        (v2) => v2[idColumnName] === v[idColumnName]
      )
      if (value && index < 0) {
        internalSelected.value.push(v)
      } else if (!value && index >= 0) {
        internalSelected.value.splice(index, 1)
      }
    })
  },
})
</script>

<style scoped>
/* ボタンを改行させないようにする */
.select-buttons > :deep(span) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
