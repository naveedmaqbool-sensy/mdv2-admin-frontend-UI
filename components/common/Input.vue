<template>
  <UInput
    v-model="data!"
    :type="type"
    :color="hasError ? 'red' : 'gray'"
    :ui="{
      variant: {
        outline: 'text-red-600',
      },
    }"
  />
</template>

<script setup lang="ts">
const data = defineModel<string | number | null>({
  type: String,
  required: true,
})

defineProps({
  hasError: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
})
</script>

<style scoped></style>
