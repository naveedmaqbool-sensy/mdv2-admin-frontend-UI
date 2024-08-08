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
    label: 'アラート確認',
    to: '/',
  },
  {
    icon: 'i-heroicons-chart-bar-square',
    label: 'モニタリング',
    to: '/monitoring',
  },
  {
    icon: 'i-heroicons-arrow-up-tray-16-solid',
    label: '発注修正',
    to: '/order',
  },
  {
    icon: 'i-heroicons-cog-6-tooth',
    label: '閾値設定',
    to: '/config',
  },
  {
    icon: 'i-heroicons-user-16-solid',
    label: 'ユーザー管理',
    to: '/user',
  },
]
</script>
