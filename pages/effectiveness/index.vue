<template>
  <div>
    <CommonHeader title="効果測定" />
    <EffectivenessLineChart :categories="categories" :height="500" />
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
  const end = endOfMonth(new Date().setMonth(start.getMonth() + 6))

  // end と start の差分日数を取得
  const diffDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )

  // 日数分のランダムんな数値を配列で生成
  return Array.from({ length: diffDays }, (_, i) => {
    return {
      row: formatterDate(new Date(start.getTime() + i * 24 * 60 * 60 * 1000)),
      amount: [3, 6, 14, 15].includes(i)
        ? 0
        : Math.floor(Math.random() * 10 + 10),
    }
  })
}
</script>

<style scoped></style>
