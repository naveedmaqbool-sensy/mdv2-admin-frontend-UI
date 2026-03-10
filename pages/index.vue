<template>
  <div class="space-y-6">
    <CommonHeader title="ダッシュボード (アラート確認)" />

    <!-- Filter Bar -->
    <UCard :ui="{ ring: 'ring-1 ring-gray-200', shadow: 'shadow-sm' }">
      <UForm :state="{}" @submit="get">
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
          <div class="flex items-center gap-4">
            <label class="whitespace-nowrap text-sm font-bold text-gray-700">
              対象期間
            </label>
            <div class="w-40">
              <CommonDatepicker v-model="formData.from" />
            </div>
            <span class="text-gray-400">～</span>
            <div class="w-40">
              <CommonDatepicker v-model="formData.to" />
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 md:ml-auto md:border-t-0 md:pt-0"
          >
            <UButton
              color="gray"
              variant="ghost"
              @click="reset"
              icon="i-heroicons-arrow-path"
              >リセット</UButton
            >
            <UButton
              color="indigo"
              @click="get"
              icon="i-heroicons-magnifying-glass"
              >確認</UButton
            >
          </div>
        </div>
      </UForm>
    </UCard>

    <!-- Alert Cards -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- STOCK ALERT CARD -->
      <UCard
        class="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        :class="{
          'bg-green-50/30 ring-2 ring-green-500/30': skuAlertCount === 0,
          'bg-yellow-50/30 ring-2 ring-yellow-400/50':
            skuAlertCount > 0 && skuAlertCount <= warningCount,
          'bg-red-50/30 ring-2 ring-red-400/50': skuAlertCount > warningCount,
        }"
        @click="onSkuAlert"
      >
        <div class="p-4 text-center">
          <h2
            class="text-xl font-bold tracking-tight"
            :class="{
              'text-green-700': skuAlertCount === 0,
              'text-yellow-700':
                skuAlertCount > 0 && skuAlertCount <= warningCount,
              'text-red-700': skuAlertCount > warningCount,
            }"
          >
            在庫アラート
          </h2>
          <div class="mb-4 mt-8 flex items-center justify-center gap-4">
            <UIcon
              v-if="skuAlertCount === 0"
              name="i-heroicons-check-circle-solid"
              class="text-5xl text-green-500 drop-shadow-sm"
            />
            <UIcon
              v-else
              name="i-heroicons-exclamation-triangle-solid"
              class="animate-pulse text-5xl drop-shadow-sm"
              :class="{
                'text-yellow-400':
                  skuAlertCount > 0 && skuAlertCount <= warningCount,
                'text-red-500': skuAlertCount > warningCount,
              }"
            />
            <div class="flex items-baseline gap-1">
              <span
                class="text-6xl font-black tracking-tighter"
                :class="{
                  'text-green-600': skuAlertCount === 0,
                  'text-yellow-600':
                    skuAlertCount > 0 && skuAlertCount <= warningCount,
                  'text-red-600': skuAlertCount > warningCount,
                }"
              >
                {{ formatterNumber(skuAlertCount) }}
              </span>
              <span class="text-xl font-bold text-gray-500">件</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- ADMIN/THRESHOLD ALERT CARD -->
      <UCard
        class="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        :class="{
          'bg-green-50/30 ring-2 ring-green-500/30': adminAlertCount === 0,
          'bg-yellow-50/30 ring-2 ring-yellow-400/50':
            adminAlertCount > 0 && adminAlertCount <= warningCount,
          'bg-red-50/30 ring-2 ring-red-400/50': adminAlertCount > warningCount,
        }"
        @click="onAdminAlert"
      >
        <div class="p-4 text-center">
          <h2
            class="text-xl font-bold tracking-tight"
            :class="{
              'text-green-700': adminAlertCount === 0,
              'text-yellow-700':
                adminAlertCount > 0 && adminAlertCount <= warningCount,
              'text-red-700': adminAlertCount > warningCount,
            }"
          >
            閾値アラート
          </h2>
          <div class="mb-4 mt-8 flex items-center justify-center gap-4">
            <UIcon
              v-if="adminAlertCount === 0"
              name="i-heroicons-check-circle-solid"
              class="text-5xl text-green-500 drop-shadow-sm"
            />
            <UIcon
              v-else
              name="i-heroicons-exclamation-triangle-solid"
              class="animate-pulse text-5xl drop-shadow-sm"
              :class="{
                'text-yellow-400':
                  adminAlertCount > 0 && adminAlertCount <= warningCount,
                'text-red-500': adminAlertCount > warningCount,
              }"
            />
            <div class="flex items-baseline gap-1">
              <span
                class="text-6xl font-black tracking-tighter"
                :class="{
                  'text-green-600': adminAlertCount === 0,
                  'text-yellow-600':
                    adminAlertCount > 0 && adminAlertCount <= warningCount,
                  'text-red-600': adminAlertCount > warningCount,
                }"
              >
                {{ formatterNumber(adminAlertCount) }}
              </span>
              <span class="text-xl font-bold text-gray-500">件</span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppStateTypes from '~/types/enums/AppStateTypes'
import type AlertFormData from '~/types/interfaces/page/alert/FormData'
import AlertFormDataFactory from '~/types/interfaces/page/alert/FormDataFactory'

const warningCount = 100
const formData = ref<AlertFormData>(
  servicePersistentStateGet(AppStateTypes.AlertFormData, {
    from: (value: string | null) => (value ? new Date(value) : null),
    to: (value: string | null) => (value ? new Date(value) : null),
  }) || new AlertFormDataFactory()
)
const skuAlertCount = ref(0)
const adminAlertCount = ref(0)

async function reset() {
  formData.value = new AlertFormDataFactory()
  await get()
}

async function get() {
  serviceLoadingStart()
  const response = await apiAlertGet(formData.value)
  serviceLoadingFinish()
  if (!response) {
    return
  }
  skuAlertCount.value = response.skuAlertCount
  adminAlertCount.value = response.adminAlertCount

  // 検索条件をブラウザに保持する
  servicePersistentStateSet(AppStateTypes.AlertFormData, formData.value)
}
await get()

function onSkuAlert() {
  useRouter().push('/stock-alert')
}
function onAdminAlert() {
  useRouter().push('/threshold-alert')
}
</script>
