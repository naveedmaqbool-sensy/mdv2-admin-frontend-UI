<template>
  <section>
    <button
      class="mt-2 w-full rounded bg-indigo-950 py-1 text-sm text-slate-200"
      @click="next"
    >
      次へ
    </button>
    <button
      class="mt-2 w-full rounded bg-gray-300 py-1 text-sm text-black"
      @click="prev"
    >
      前へ
    </button>

    <div class="pt-2 text-center">
      ({{ formatterNumber(totalCount) }} 件中 {{ formatterNumber(min) }} ～
      {{ formatterNumber(max) }} 件目)
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PaginationRequest } from '~/types/interfaces/common/Pagination'

const request = defineModel<PaginationRequest>('request', {
  type: Object,
  required: true,
})
const { totalCount } = defineProps<{
  totalCount: number
}>()
const emit = defineEmits<{
  change: []
}>()

const min = computed(() => (request.value.page - 1) * request.value.perPage + 1)
const max = computed(() =>
  request.value.page * request.value.perPage > totalCount
    ? totalCount
    : request.value.page * request.value.perPage
)

function next() {
  if (totalCount > request.value.page * request.value.perPage) {
    ++request.value.page
    emit('change')
  }
}

function prev() {
  if (request.value.page > 1) {
    --request.value.page
    emit('change')
  }
}
</script>
