<template>
  <div>
    <CommonHeader title="効果測定" />
    <EffectivenessLineChart
      :categories="categories"
      :width="1400"
      :height="500"
    />
  </div>
</template>

<script setup lang="ts">
import { endOfMonth, startOfMonth } from 'date-fns'

const categories = ref([
  {
    name: '在庫数',
    values: createAmount(),
  },
  {
    name: '販売数',
    values: createAmount(),
  },
  {
    name: '入荷数',
    values: createAmount(),
  },
])

function createAmount() {
  const start = startOfMonth(new Date())
  const end = endOfMonth(new Date())

  return Array.from({ length: end.getDate() - start.getDate() + 1 }, (_, i) => {
    return {
      row: formatterDate(new Date(start.getTime() + i * 24 * 60 * 60 * 1000)),
      amount: [3, 6, 14, 15].includes(i) ? 0 : Math.floor(Math.random() * 100),
    }
  })
}
</script>

<style scoped></style>
