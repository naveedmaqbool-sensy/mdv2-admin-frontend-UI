<template>
  <section class="my-2 flex max-w-full">
    <div class="flex-1">
      <h2 class="text-lg font-bold">{{ props.title }}</h2>
    </div>
    <div class="flex flex-1 justify-end"><slot name="right-content" /></div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
  }>(),
  {}
)
</script>
