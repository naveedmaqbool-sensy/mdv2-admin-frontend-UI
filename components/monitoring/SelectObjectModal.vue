<template>
  <UModal v-model="isOpenModal" :ui="{ width: modalWidth }">
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

      <UTable
        :rows="items"
        :columns="headers"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: isAlreadyLoaded
            ? 'データが見つかりません'
            : '検索してください',
        }"
        @select="onSelected"
      >
        <template #selected-data="{ row }">
          <UCheckbox
            v-if="!isRadio"
            :model-value="
              internalSelected.findIndex(
                (v) => v[idColumnName] === row[idColumnName]
              ) >= 0
            "
          />
          <URadio
            v-if="isRadio"
            v-bind="{ value: row[idColumnName], name: '' }"
            v-model="selectedRadio"
          />
        </template>
        <template #selected-header>
          <UCheckbox v-if="!isRadio" v-model="allSelected" />
          <span v-else></span>
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
const { columns, idColumnName, isRadio, initialStateIsEmpty } = withDefaults(
  defineProps<{
    columns: { key: string; label: string }[]
    idColumnName: string
    isRadio?: boolean
    initialStateIsEmpty?: boolean
  }>(),
  {
    isRadio: false,
    initialStateIsEmpty: false,
  }
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
const isAlreadyLoaded = ref(false)

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
const emit = defineEmits<{
  fetchItems: [searchRequest: SearchRequest]
  change: []
}>()

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
    isAlreadyLoaded.value = false
    if (!initialStateIsEmpty) {
      await fetch(1)
    }
  }
})

const page = computed(() => searchRequest.value.page)
watch(page, (value) => {
  fetch(value)
})

function save() {
  selected.value = [...internalSelected.value]
  isOpenModal.value = false

  emit('change')
}

async function fetch(page: number) {
  searchRequest.value.page = page
  await emit('fetchItems', searchRequest.value)
  isAlreadyLoaded.value = true
}

function onSelected(row: any) {
  if (isRadio) {
    internalSelected.value = [row]
    return
  }
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
  return [{ key: 'selected', label: '選択', class: 'w-8' }, ...columns]
})

const selectedRadio = computed({
  get: () => {
    if (internalSelected.value.length > 0) {
      return internalSelected.value[0][idColumnName]
    }
    return null
  },
  set: (id) => {
    if (id) {
      internalSelected.value = [items.value.find((v) => v[idColumnName] === id)]
    } else {
      internalSelected.value = []
    }
  },
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

// 表示する項目の数次第でモーダル自体の大きさを変える
const modalWidth = computed(() => {
  if (headers.value.length <= 2) {
    return 'w-full sm:max-w-lg'
  } else if (headers.value.length <= 4) {
    return 'w-full sm:max-w-xl'
  } else if (headers.value.length <= 6) {
    return 'w-full sm:max-w-3xl'
  }
  return 'w-full sm:max-w-4xl'
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
