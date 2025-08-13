<template>
  <div>
    <CommonHeader title="効果測定" />
    <EffectivenessLineChart :categories="categories" :height="500" />
  </div>
</template>

<script setup lang="ts">
const categories = ref<any[]>([])

async function fetch() {
  serviceLoadingStart()
  const response = await apiEffectivenessFetch({})
  if (!response) {
    serviceLoadingFinish()
    return
  }

  categories.value = response

  serviceLoadingFinish()
}

// 初期表示データ取得（検索するまで初期表示はいらないのでモックの時だけ）
await fetch()
</script>

<style scoped></style>
