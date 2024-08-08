<template>
  <section class="my-2 flex max-w-full">
    <div class="flex-1">
      <h1 class="text-xl font-bold">{{ props.title }}</h1>
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
