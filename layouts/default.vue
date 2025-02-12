<template>
  <section>
    <AppHeader class="sticky top-0 z-50" @on-menu-click="onMenuClick" />
    <div class="flex">
      <transition
        :duration="{ enter: 100, leave: 100 }"
        enter-active-class="transition ease-in-out transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in-out transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside v-if="isActiveMenu" class="min-h-[100vh] bg-gray-200">
          <div class="sticky top-16 w-44 pl-6">
            <UVerticalNavigation :links="links" />
          </div>
        </aside>
      </transition>
      <main class="w-full">
        <UContainer class="my-4">
          <slot />
        </UContainer>
      </main>
    </div>
    <AppFooter />
    <OrderEvidenceExportModal
      v-model:is-open-modal="isActiveExportModal"
      :target-date-from="evidenceTargetDateFrom"
      :target-date-to="evidenceTargetDateTo"
      @submit="exportOrderEvidence"
    />
  </section>
</template>

<script setup lang="ts">
import { addDays, endOfDay, startOfDay, subDays } from 'date-fns'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

const isActiveExportModal = ref(false)
const evidenceTargetDateFrom = ref(startOfDay(subDays(new Date(), 7)))
const evidenceTargetDateTo = ref(endOfDay(addDays(new Date(), 7)))

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
    icon: 'i-heroicons-arrow-down-tray-16-solid',
    label: '発注数量算出\nエビデンス',
    click: () => {
      isActiveExportModal.value = true
    },
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

const isActiveMenu = ref(false)

function onMenuClick() {
  isActiveMenu.value = !isActiveMenu.value
}

async function exportOrderEvidence(params: {
  from: Date
  to: Date
  sku: any
  store: StoreMaster
}) {
  // 出力処理を実行
  serviceLoadingStart()
  await apiOrderEvidenceExport(params)
  serviceLoadingFinish()
}
</script>

<style scoped>
:deep(span.truncate) {
  white-space: pre-line;
  text-align: left;
}
</style>
