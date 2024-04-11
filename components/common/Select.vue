<template>
  <USelectMenu
    v-model="selected"
    :legend="title"
    :options="options"
    option-attribute="name"
    value-attribute="value"
  />
</template>

<script setup lang="ts">
const selected = defineModel('selected', {
  type: Number,
  required: true,
})

const { options, title } = withDefaults(
  defineProps<{
    options: { value: number; name: string }[]
    title?: string | null
  }>(),
  {
    title: null,
  }
)
</script>

<style scoped></style>
