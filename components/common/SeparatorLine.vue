<template>
  <hr
    v-if="isFullScreen"
    class="ml-[-1rem] mr-[-1rem] w-[100vw] border-[1.5px] border-b border-t border-indigo-950"
  />
  <hr
    v-else
    class="w-full border-[1.5px] border-b border-t border-indigo-950"
  />
</template>

<script setup lang="ts">
const { isFullScreen } = withDefaults(
  defineProps<{
    isFullScreen?: boolean
  }>(),
  {
    isFullScreen: false,
  }
)
</script>
