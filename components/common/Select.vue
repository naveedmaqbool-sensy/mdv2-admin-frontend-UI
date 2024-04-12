<template>
  <USelectMenu
    v-model="selected"
    :legend="title"
    :options="options"
    option-attribute="name"
    value-attribute="value"
    placeholder="選択してください"
    @change="onChange"
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

const emit = defineEmits<{ change: [] }>()

function onChange(value: number | null) {
  if (selected.value !== value) {
    emit('change')
  }
}
</script>

<style scoped></style>
