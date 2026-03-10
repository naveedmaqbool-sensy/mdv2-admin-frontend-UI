<template>
  <div class="flex h-[100dvh] flex-col bg-[#F9FAFB] text-gray-900">
    <AppHeader class="sticky top-0 z-50 w-full" @on-menu-click="onMenuClick" />
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Area -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="-ml-60 opacity-0"
        enter-to-class="ml-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="ml-0 opacity-100"
        leave-to-class="-ml-60 opacity-0"
      >
        <aside
          v-show="isActiveMenu"
          class="flex w-60 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white shadow-[1px_0_2px_0_rgba(0,0,0,0.02)]"
        >
          <div class="flex flex-1 flex-col gap-2 p-4">
            <!-- 1. Dashboard Accordion (Moved to very top) -->
            <UAccordion
              color="gray"
              variant="ghost"
              :items="[
                {
                  label: 'ダッシュボード',
                  icon: 'i-heroicons-home',
                  defaultOpen: true,
                  slot: 'dashboard',
                },
              ]"
              :ui="{ wrapper: 'w-full' }"
            >
              <template #dashboard>
                <div class="ml-5 mt-1 border-l border-gray-100 pb-1 pl-4">
                  <UVerticalNavigation
                    :links="dashboardMenu"
                    :ui="{
                      padding: 'py-2 px-3',
                      size: 'text-sm text-gray-600 font-medium',
                      rounded: 'rounded-md',
                      active:
                        'text-indigo-600 before:bg-indigo-50 before:rounded-md',
                      inactive: 'hover:text-gray-900 hover:before:bg-gray-50',
                    }"
                  />
                </div>
              </template>
            </UAccordion>

            <div class="my-1 border-t border-gray-100"></div>

            <!-- 2. Main Navigation Links -->
            <UVerticalNavigation
              :links="links"
              :ui="{
                padding: 'py-2.5 px-3',
                size: 'text-sm font-medium',
                rounded: 'rounded-lg',
                active: 'text-indigo-700 before:bg-indigo-50 before:rounded-lg',
                inactive:
                  'text-gray-600 hover:text-gray-900 hover:before:bg-gray-50',
              }"
            />

            <div class="my-1 border-t border-gray-100"></div>

            <!-- 3. Order Conditions Accordion -->
            <UAccordion
              color="gray"
              variant="ghost"
              :items="[
                {
                  label: '発注条件マスタ',
                  icon: 'i-heroicons-rectangle-group',
                  defaultOpen: false,
                  slot: 'order-conditions',
                },
              ]"
              :ui="{ wrapper: 'w-full' }"
            >
              <template #order-conditions>
                <div class="ml-5 mt-1 border-l border-gray-100 pb-1 pl-4">
                  <UVerticalNavigation
                    :links="orderConditionsMenu"
                    :ui="{
                      padding: 'py-2 px-3',
                      size: 'text-sm text-gray-600 font-medium',
                      rounded: 'rounded-md',
                      active:
                        'text-indigo-600 before:bg-indigo-50 before:rounded-md',
                      inactive: 'hover:text-gray-900 hover:before:bg-gray-50',
                    }"
                  />
                </div>
              </template>
            </UAccordion>
          </div>
        </aside>
      </transition>

      <!-- Main Content Area -->
      <main class="w-full flex-1 overflow-y-auto">
        <div class="mx-auto max-w-[1600px] p-6 sm:p-8 lg:p-12">
          <slot />
        </div>
      </main>
    </div>
    <AppFooter />
    <OrderEvidenceExportModal
      v-model:is-open-modal="isActiveExportModal"
      :target-date-from="evidenceTargetDateFrom"
      :target-date-to="evidenceTargetDateTo"
      :selected-skus="[]"
      :selected-stores="[]"
      @submit="exportOrderEvidence"
    />
  </div>
</template>

<script setup lang="ts">
import { addDays, endOfDay, startOfDay, subDays } from 'date-fns'
import type StoreMaster from '~/types/interfaces/database/SensyCloud/StoreMaster'

const { $config } = useNuxtApp()
const isActiveExportModal = ref(false)
const evidenceTargetDateFrom = ref(startOfDay(subDays(new Date(), 7)))
const evidenceTargetDateTo = ref(endOfDay(addDays(new Date(), 7)))

const dashboardMenu = [
  {
    icon: 'i-heroicons-squares-2x2',
    label: 'ダッシュボードトップ',
    to: '/',
  },
  {
    icon: 'i-heroicons-shield-check',
    label: '在庫アラート',
    to: '/stock-alert',
  },
  {
    icon: 'i-heroicons-bell-alert',
    label: '閾値アラート',
    to: '/threshold-alert',
  },
]

const links = [
  [
    {
      icon: 'i-heroicons-chart-bar-square',
      label: 'モニタリング',
      to: '/monitoring',
    },
    {
      icon: 'i-heroicons-presentation-chart-line',
      label: '効果測定',
      to: '/effectiveness',
    },
    {
      icon: 'i-heroicons-pencil-square',
      label: '発注修正',
      to: '/order',
    },
    {
      icon: 'i-heroicons-document-arrow-down',
      label: 'エビデンス出力',
      click: () => {
        isActiveExportModal.value = true
      },
    },
    {
      icon: 'i-heroicons-adjustments-horizontal',
      label: 'アラート閾値設定',
      to: '/config',
    },
    {
      icon: 'i-heroicons-users',
      label: 'ユーザー管理',
      to: '/user',
    },
  ],
]
const isActiveMenu = ref($config.public.environment === 'local')

const orderConditionsMenu = [
  {
    icon: 'i-heroicons-list-bullet',
    label: '商品別発注条件',
    to: '/order-conditions',
  },
  {
    icon: 'i-heroicons-plus-circle',
    label: '発注条件一括更新',
    to: '/order-conditions/upsert',
  },
  {
    icon: 'i-heroicons-clock',
    label: '一括更新履歴',
    to: '/order-conditions/history',
  },
  {
    icon: 'i-heroicons-document-text',
    label: '一括CSV更新',
    to: '/order-conditions/import',
  },
]

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
