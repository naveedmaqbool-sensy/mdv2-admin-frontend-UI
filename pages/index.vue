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

    <!-- Filter Bar (Glassmorphic) -->
    <div
      class="relative overflow-hidden rounded-2xl bg-white/70 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 backdrop-blur-xl"
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10"
      ></div>
      <UForm
        :state="{}"
        class="relative rounded-xl bg-white/50 p-5 backdrop-blur-md"
        @submit="get"
      >
        <div class="flex flex-col gap-5 md:flex-row md:items-center">
          <div class="flex items-center gap-4">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 shadow-inner"
            >
              <UIcon name="i-heroicons-calendar-days" class="text-xl" />
            </div>
            <label
              class="whitespace-nowrap text-sm font-bold tracking-wide text-gray-700"
            >
              対象期間
            </label>
            <div
              class="w-44 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <CommonDatepicker v-model="formData.from" />
            </div>
            <span class="font-light text-gray-400">～</span>
            <div
              class="w-44 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <CommonDatepicker v-model="formData.to" />
            </div>
          </div>
          <div
            class="flex items-center justify-end gap-3 border-t border-gray-100/80 pt-5 md:ml-auto md:border-t-0 md:pt-0"
          >
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-arrow-path"
              class="rounded-full px-5 transition-colors hover:bg-gray-100/80"
              @click="reset"
            >
              リセット
            </UButton>
            <UButton
              color="indigo"
              icon="i-heroicons-magnifying-glass"
              class="rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
              @click="get"
            >
              確認
            </UButton>
          </div>
        </div>
      </UForm>
    </div>

    <!-- Alert Cards (Neo-Glassmorphism & Emotional Call to Action) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- STOCK ALERT CARD -->
      <div
        class="group relative cursor-pointer overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        :class="{
          'bg-gradient-to-br from-green-400/50 to-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]':
            skuAlertCount === 0,
          'bg-gradient-to-br from-amber-400/60 to-orange-500/30 shadow-[0_0_25px_rgba(251,191,36,0.2)]':
            skuAlertCount > 0 && skuAlertCount <= warningCount,
          'bg-gradient-to-br from-rose-500/60 to-red-600/40 shadow-[0_0_30px_rgba(244,63,94,0.3)]':
            skuAlertCount > warningCount,
        }"
        @click="onSkuAlert"
      >
        <div
          class="relative h-full w-full rounded-[23px] bg-white/90 p-8 pt-10 backdrop-blur-xl"
        >
          <!-- Background decorative element -->
          <div
            class="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150"
            :class="{
              'bg-green-500': skuAlertCount === 0,
              'bg-amber-500':
                skuAlertCount > 0 && skuAlertCount <= warningCount,
              'bg-rose-500': skuAlertCount > warningCount,
            }"
          ></div>

          <div
            class="relative flex flex-col items-center justify-center text-center"
          >
            <div
              class="mb-6 rounded-2xl p-4 shadow-inner"
              :class="{
                'bg-green-50 text-green-500': skuAlertCount === 0,
                'bg-amber-50 text-amber-500 ring-1 ring-amber-500/20':
                  skuAlertCount > 0 && skuAlertCount <= warningCount,
                'bg-rose-50 text-rose-500 ring-1 ring-rose-500/20':
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
              class="text-xl font-black uppercase tracking-widest text-gray-400"
            >
              在庫アラート
            </h2>

            <div class="mt-4 flex items-baseline justify-center gap-2">
              <span
                class="bg-clip-text text-8xl font-black tracking-tighter text-transparent transition-all duration-300"
                :class="{
                  'bg-gradient-to-br from-green-500 to-emerald-600':
                    skuAlertCount === 0,
                  'bg-gradient-to-br from-amber-500 to-orange-600':
                    skuAlertCount > 0 && skuAlertCount <= warningCount,
                  'bg-gradient-to-br from-rose-500 to-red-600':
                    skuAlertCount > warningCount,
                }"
              >
                {{ formatterNumber(skuAlertCount) }}
              </span>
              <span class="text-2xl font-bold text-gray-400">件</span>
            </div>

            <div
              class="mt-8 flex items-center text-sm font-bold transition-transform duration-300 group-hover:translate-x-2"
              :class="{
                'text-green-600': skuAlertCount === 0,
                'text-amber-600':
                  skuAlertCount > 0 && skuAlertCount <= warningCount,
                'text-rose-600': skuAlertCount > warningCount,
              }"
            >
              詳細を確認する
              <UIcon name="i-heroicons-arrow-right" class="ml-1" />
            </div>
          </div>
        </div>
      </div>

      <!-- ADMIN/THRESHOLD ALERT CARD -->
      <div
        class="group relative cursor-pointer overflow-hidden rounded-3xl p-[1px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        :class="{
          'bg-gradient-to-br from-green-400/50 to-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]':
            adminAlertCount === 0,
          'bg-gradient-to-br from-amber-400/60 to-orange-500/30 shadow-[0_0_25px_rgba(251,191,36,0.2)]':
            adminAlertCount > 0 && adminAlertCount <= warningCount,
          'bg-gradient-to-br from-rose-500/60 to-red-600/40 shadow-[0_0_30px_rgba(244,63,94,0.3)]':
            adminAlertCount > warningCount,
        }"
        @click="onAdminAlert"
      >
        <div
          class="relative h-full w-full rounded-[23px] bg-white/90 p-8 pt-10 backdrop-blur-xl"
        >
          <!-- Background decorative element -->
          <div
            class="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10 blur-3xl transition-transform duration-700 group-hover:scale-150"
            :class="{
              'bg-green-500': adminAlertCount === 0,
              'bg-amber-500':
                adminAlertCount > 0 && adminAlertCount <= warningCount,
              'bg-rose-500': adminAlertCount > warningCount,
            }"
          ></div>

          <div
            class="relative flex flex-col items-center justify-center text-center"
          >
            <div
              class="mb-6 rounded-2xl p-4 shadow-inner"
              :class="{
                'bg-green-50 text-green-500': adminAlertCount === 0,
                'bg-amber-50 text-amber-500 ring-1 ring-amber-500/20':
                  adminAlertCount > 0 && adminAlertCount <= warningCount,
                'bg-rose-50 text-rose-500 ring-1 ring-rose-500/20':
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
              class="text-xl font-black uppercase tracking-widest text-gray-400"
            >
              閾値アラート
            </h2>

            <div class="mt-4 flex items-baseline justify-center gap-2">
              <span
                class="bg-clip-text text-8xl font-black tracking-tighter text-transparent transition-all duration-300"
                :class="{
                  'bg-gradient-to-br from-green-500 to-emerald-600':
                    adminAlertCount === 0,
                  'bg-gradient-to-br from-amber-500 to-orange-600':
                    adminAlertCount > 0 && adminAlertCount <= warningCount,
                  'bg-gradient-to-br from-rose-500 to-red-600':
                    adminAlertCount > warningCount,
                }"
              >
                {{ formatterNumber(adminAlertCount) }}
              </span>
              <span class="text-2xl font-bold text-gray-400">件</span>
            </div>

            <div
              class="mt-8 flex items-center text-sm font-bold transition-transform duration-300 group-hover:translate-x-2"
              :class="{
                'text-green-600': adminAlertCount === 0,
                'text-amber-600':
                  adminAlertCount > 0 && adminAlertCount <= warningCount,
                'text-rose-600': adminAlertCount > warningCount,
              }"
            >
              詳細を確認する
              <UIcon name="i-heroicons-arrow-right" class="ml-1" />
            </div>
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
