<template>
  <div class="flex justify-center">
    <button
      v-for="button in buttons"
      :key="button.title"
      class="w-1/2 border border-gray-400 bg-blue-950 px-4 py-2 text-sm font-bold text-slate-200"
      @click="button.action()"
    >
      {{ button.title }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  buttons: { title: string; action: CallableFunction }[]
}>()
</script>
