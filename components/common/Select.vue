<template>
  <USelectMenu
    v-model="selected"
    :legend="title"
    :options="options"
    option-attribute="name"
    value-attribute="value"
    :placeholder="placeholder"
    clearable
    :disabled="disabled"
    @change="onChange"
  />
</template>

<script setup lang="ts">
const selected = defineModel<number | null>('selected', {
  type: Number,
  required: false,
})

const props = withDefaults(
  defineProps<{
    options: { value: number | boolean | string; name: string }[]
    title?: string | null
    clearable?: boolean
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    title: null,
    clearable: true,
    placeholder: '選択してください',
    disabled: false,
  }
)
const disabled = toRef(props, 'disabled')

const emit = defineEmits<{ change: [] }>()

function onChange(value: number | null) {
  if (selected.value !== value) {
    emit('change')
  }
}
</script>

<style scoped></style>
