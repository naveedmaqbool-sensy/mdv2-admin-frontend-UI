<template>
  <div v-if="messages && messages.length > 0">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="text-xs text-red-400"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  messages: {
    type: Array,
    default: null,
  },
})
</script>

<style scoped></style>
