<template>
  <select
    v-model="perPage"
    class="rounded border border-gray-300 px-2 py-1"
    @change="$emit('change')"
  >
    <option
      v-for="(value, key) in perPages"
      :key="key"
      :value="value"
      :selected="perPage === value"
    >
      {{ formatterNumber(value) }}件
    </option>
  </select>
</template>

<script setup lang="ts">
const perPages = [5, 10, 50, 100, 200, 300, 400, 500]
const perPage = defineModel<number>({
  type: Number,
  required: true,
})

defineEmits<{
  change: []
}>()
</script>
