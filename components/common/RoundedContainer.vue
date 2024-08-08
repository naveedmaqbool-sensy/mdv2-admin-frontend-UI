<template>
  <div class="container mx-auto py-2">
    <div
      class="not-prose relative flex rounded-t-md border border-b-0 border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
    >
      <slot name="header" />
    </div>
    <div
      class="not-prose relative flex rounded-b-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
