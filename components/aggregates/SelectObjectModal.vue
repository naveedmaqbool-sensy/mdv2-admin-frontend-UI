<template>
  <UButton
    icon="i-heroicons-bars-4"
    :label="buttonLabel"
    color="gray"
    block
    class="select-buttons"
    @click="isOpenModal = true"
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

      <UTable v-model="internalSelected" :rows="items" :columns="columns" />

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

const { items, columns, nameColumn } = withDefaults(
  defineProps<{
    items: any[]
    columns: { key: string; label: string }[]
    nameColumn: string
  }>(),
  {}
)

const selected = defineModel<any[]>('selected', {
  type: Array,
  required: true,
})
const internalSelected = ref<any>([])

type SearchRequest = {
  text: string | null
  page: number
}
const searchRequest = ref<SearchRequest>({
  text: null,
  page: 1,
})
const emit = defineEmits<{ fetchItems: [searchRequest: SearchRequest] }>()

// 開いた時の初期化
watch(isOpenModal, (value) => {
  if (value) {
    searchRequest.value = {
      page: 1,
      text: null,
    }
    internalSelected.value = [...selected.value]
    emit('fetchItems', searchRequest.value)
  }
})

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
</script>

<style scoped>
/* ボタンを改行させないようにする */
.select-buttons > ::v-deep span {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
