<template>
  <div class="animate-fade-in space-y-8">
    <!-- Header with greeting/status -->
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-3xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm"
        >
          ダッシュボード
        </h1>
        <p class="mt-1 text-sm font-medium text-gray-500">
          システムのアラート状況をリアルタイムで監視しています
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
      <UForm :state="{}" @submit="get">
        <div class="flex flex-col gap-5 md:flex-row md:items-center">
          <div class="flex items-center gap-4">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"
            >
              <UIcon name="i-heroicons-calendar-days" class="text-xl" />
            </div>
            <label
              class="whitespace-nowrap text-sm font-semibold tracking-wide text-gray-700"
            >
              対象期間
            </label>
            <div class="w-44">
              <CommonDatepicker v-model="formData.from" />
            </div>
            <span class="font-light text-gray-400">～</span>
            <div class="w-44">
              <CommonDatepicker v-model="formData.to" />
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 md:ml-auto md:border-t-0 md:pt-0"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              class="px-5 text-gray-500 hover:bg-gray-50"
              @click="reset"
            >
              リセット
            </UButton>
            <UButton
              color="primary"
              icon="i-heroicons-magnifying-glass"
              class="px-6 font-semibold"
              @click="get"
            >
              確認
            </UButton>
          </div>
        </div>
      </UForm>
    </div>

    <!-- Alert Cards -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- STOCK ALERT CARD -->
      <div
        class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-8 pt-10 ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-500/30"
        @click="onSkuAlert"
      >
        <div
          class="relative flex flex-col items-center justify-center text-center"
        >
          <div
            class="mb-6 rounded-2xl p-4 shadow-sm ring-1 ring-gray-100"
            :class="{
              'bg-green-50 text-green-600': skuAlertCount === 0,
              'bg-amber-50 text-amber-600 ring-amber-100':
                skuAlertCount > 0 && skuAlertCount <= warningCount,
              'bg-rose-50 text-rose-600 ring-rose-100':
                skuAlertCount > warningCount,
            }"
          >
            <UIcon
              v-if="skuAlertCount === 0"
              name="i-heroicons-shield-check"
              class="text-4xl"
            />
            <UIcon
              v-else
              name="i-heroicons-exclamation-triangle-solid"
              class="text-4xl duration-1000"
              :class="{
                'animate-[pulse_2s_ease-in-out_infinite]':
                  skuAlertCount > warningCount,
              }"
            />
          </div>

          <h2
            class="text-sm font-semibold uppercase tracking-wider text-gray-500"
          >
            在庫アラート
          </h2>

          <div class="mt-4 flex items-baseline justify-center gap-2">
            <span
              class="text-7xl font-bold tracking-tight transition-all duration-300"
              :class="{
                'text-green-500': skuAlertCount === 0,
                'text-amber-500':
                  skuAlertCount > 0 && skuAlertCount <= warningCount,
                'text-rose-500': skuAlertCount > warningCount,
              }"
            >
              {{ formatterNumber(skuAlertCount) }}
            </span>
            <span class="text-xl font-medium text-gray-400">件</span>
          </div>

          <div
            class="mt-8 flex items-center text-sm font-medium text-indigo-600 transition-transform duration-300 group-hover:translate-x-1"
          >
            詳細を確認する
            <UIcon name="i-heroicons-arrow-right" class="ml-1" />
          </div>
        </div>
      </div>

      <!-- ADMIN/THRESHOLD ALERT CARD -->
      <div
        class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-8 pt-10 ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-indigo-500/30"
        @click="onAdminAlert"
      >
        <div
          class="relative flex flex-col items-center justify-center text-center"
        >
          <div
            class="mb-6 rounded-2xl p-4 shadow-sm ring-1 ring-gray-100"
            :class="{
              'bg-green-50 text-green-600': adminAlertCount === 0,
              'bg-amber-50 text-amber-600 ring-amber-100':
                adminAlertCount > 0 && adminAlertCount <= warningCount,
              'bg-rose-50 text-rose-600 ring-rose-100':
                adminAlertCount > warningCount,
            }"
          >
            <UIcon
              v-if="adminAlertCount === 0"
              name="i-heroicons-shield-check"
              class="text-4xl"
            />
            <UIcon
              v-else
              name="i-heroicons-bell-alert-solid"
              class="text-4xl duration-1000"
              :class="{
                'animate-[pulse_2s_ease-in-out_infinite]':
                  adminAlertCount > warningCount,
              }"
            />
          </div>

          <h2
            class="text-sm font-semibold uppercase tracking-wider text-gray-500"
          >
            閾値アラート
          </h2>

          <div class="mt-4 flex items-baseline justify-center gap-2">
            <span
              class="text-7xl font-bold tracking-tight transition-all duration-300"
              :class="{
                'text-green-500': adminAlertCount === 0,
                'text-amber-500':
                  adminAlertCount > 0 && adminAlertCount <= warningCount,
                'text-rose-500': adminAlertCount > warningCount,
              }"
            >
              {{ formatterNumber(adminAlertCount) }}
            </span>
            <span class="text-xl font-medium text-gray-400">件</span>
          </div>

          <div
            class="mt-8 flex items-center text-sm font-medium text-indigo-600 transition-transform duration-300 group-hover:translate-x-1"
          >
            詳細を確認する
            <UIcon name="i-heroicons-arrow-right" class="ml-1" />
          </div>
        </div>
      </div>
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
