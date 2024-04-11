<template>
  <section>
    <AppHeader />
    <div class="flex">
      <aside class="h-[100vh] w-64 bg-gray-200 p-4">
        <UVerticalNavigation :links="links" />
      </aside>
      <main class="w-full">
        <UContainer class="my-4">
          <slot />
        </UContainer>
      </main>
    </div>
    <AppFooter />
  </section>
</template>

<script setup lang="ts">
const links = [
  {
    icon: 'i-heroicons-home',
    label: 'ダッシュボード',
    to: '/',
  },
  {
    icon: 'i-heroicons-chart-bar-square',
    label: '集計',
    to: '/aggregate',
  },
]
</script>
