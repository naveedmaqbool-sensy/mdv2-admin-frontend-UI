<template>
  <UButton
    icon="i-heroicons-bars-4"
    :label="buttonLabel"
    color="gray"
    block
    class="select-buttons"
    @click="openModal"
  />
  <UModal v-model="isOpenModal">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <UForm :state="{}" @submit="fetch(1)">
          <UInput
            v-model="searchRequest.text"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="検索"
          />
        </UForm>
      </template>

      <UTable
        v-model="internalSelected"
        :rows="items"
        :columns="columns"
        @select="onSelected"
      />

      <template #footer>
        <div class="block text-right">
          <UButton color="gray" label="閉じる" @click="isOpenModal = false" />
          <UButton color="primary" class="ml-2" label="保存" @click="save" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpenModal = ref(false)

const { columns, nameColumn } = withDefaults(
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

const selected = defineModel<any[]>('selected', {
  type: Array,
  required: true,
})
const internalSelected = ref<any>([])

type SearchRequest = {
  text: string | null
  page: number
  perPage: number
}
const searchRequest = ref<SearchRequest>({
  text: null,
  page: 1,
  perPage: 10,
})
const emit = defineEmits<{ fetchItems: [searchRequest: SearchRequest] }>()

async function openModal() {
  searchRequest.value = {
    ...searchRequest.value,
    page: 1,
    text: null,
  }
  internalSelected.value = [...selected.value]
  await emit('fetchItems', searchRequest.value)

  isOpenModal.value = true
}

function save() {
  selected.value = [...internalSelected.value]
  isOpenModal.value = false
}

const buttonLabel = computed(() => {
  if (selected.value.length === 0) return '指定なし'
  return selected.value.map((v) => v[nameColumn]).join(', ')
})

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
.select-buttons > ::v-deep span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
