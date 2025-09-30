<template>
  <input
    id="event-date"
    v-model="internalDate"
    :type="inputType"
    name="event-date"
    class="block h-[25px] w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  />
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import TargetDateRangeTypes from '~/types/enums/TargetDateRangeTypes'

const date = defineModel<Date | string | null>('date', {
  required: true,
})

const type = defineModel<TargetDateRangeTypes>('type', {
  required: true,
  default: () => {
    return TargetDateRangeTypes.Daily
  },
})

const inputType = computed(() => {
  return type.value === TargetDateRangeTypes.Monthly ? 'month' : 'date'
})

const formatString = computed(() => {
  if (type.value === TargetDateRangeTypes.Monthly) {
    return 'yyyy-MM'
  } else {
    return 'yyyy-MM-dd'
  }
})

const internalDate = computed({
  get: () =>
    date.value ? format(new Date(date.value), formatString.value) : '',
  set: (value) => {
    date.value = value ? new Date(value) : null
  },
})

watch(type, () => {
  internalDate.value = ''
})
</script>
