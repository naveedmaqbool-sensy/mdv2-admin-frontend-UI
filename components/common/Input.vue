<template>
  <UInput
    v-model="text!"
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
const props = defineProps({
  modelValue: {
    type: [String, Number, null] as PropType<string | number | null>,
    default: null,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits(['update:model-value', 'close'])

const text = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  },
})
</script>

<style scoped></style>
