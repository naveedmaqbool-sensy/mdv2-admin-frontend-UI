<template>
  <div>
    <CommonHeader title="アラート確認" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <div class="my-auto basis-1/12">
            <label class="whitespace-nowrap pr-2 text-right font-bold">
              対象期間
            </label>
          </div>
          <div class="basis-2/12">
            <CommonDatepicker v-model="formData.from" />
          </div>
          <div class="my-auto px-2">～</div>
          <div class="basis-2/12">
            <CommonDatepicker v-model="formData.to" />
          </div>
        </div>
      </section>
      <section class="pt-2">
        <UButton color="white" @click="reset">リセット</UButton>
        <UButton class="ml-2" color="indigo" @click="get">確認</UButton>
      </section>
    </UForm>

    <section class="pt-5">
      <div class="flex flex-row">
        <div class="basis-1/2 pr-1">
          <section
            :class="{
              'border-green-500': skuAlertCount === 0,
              'border-yellow-400':
                skuAlertCount > 0 && skuAlertCount <= warningCount,
              'border-red-400': skuAlertCount > warningCount,
            }"
            class="cursor-pointer rounded border p-4 hover:translate-y-[-2px] hover:shadow-lg"
            @click="onSkuAlert"
          >
            <h1 class="text-lg font-bold">在庫アラート</h1>
            <div class="py-10 text-center">
              <UIcon
                name="i-heroicons-check-16-solid"
                class="-mb-1 text-4xl text-green-500"
                v-if="skuAlertCount === 0"
              />
              <UIcon
                v-else
                name="i-heroicons-exclamation-triangle-16-solid"
                class="-mb-1 text-4xl"
                :class="{
                  'text-yellow-400':
                    skuAlertCount > 0 && skuAlertCount <= warningCount,
                  'text-red-400': skuAlertCount > warningCount,
                }"
              />
              <span class="ml-5 text-4xl">
                {{ formatterNumber(skuAlertCount) }}
              </span>
              <span class="pl-2 text-lg">件</span>
            </div>
          </section>
        </div>
        <div class="basis-1/2 pl-1">
          <section
            :class="{
              'rounded border p-4': true,
              'border-green-500': adminAlertCount === 0,
              'border-yellow-400':
                adminAlertCount > 0 && adminAlertCount <= warningCount,
              'border-red-400': adminAlertCount > warningCount,
            }"
            class="cursor-pointer rounded border p-4 hover:translate-y-[-2px] hover:shadow-lg"
            @click="onAdminAlert"
          >
            <h1 class="text-lg font-bold">閾値アラート</h1>
            <div class="py-10 text-center">
              <UIcon
                name="i-heroicons-check-16-solid"
                class="-mb-1 text-4xl text-green-500"
                v-if="adminAlertCount === 0"
              />
              <UIcon
                v-else
                name="i-heroicons-exclamation-triangle-16-solid"
                class="-mb-1 text-4xl"
                :class="{
                  'text-yellow-400':
                    adminAlertCount > 0 && adminAlertCount <= warningCount,
                  'text-red-400': adminAlertCount > warningCount,
                }"
              />
              <span class="ml-5 text-4xl">
                {{ formatterNumber(adminAlertCount) }}
              </span>
              <span class="pl-2 text-lg">件</span>
            </div>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import FormDataFactory from '~/types/interfaces/page/alert/FormDataFactory'

const warningCount = 100
const formData = ref(new FormDataFactory())
const skuAlertCount = ref(0)
const adminAlertCount = ref(0)

function reset() {
  formData.value = new FormDataFactory()
  get()
}

async function get() {
  const response = await apiAlertGet(formData.value)
  if (!response) {
    return
  }
  skuAlertCount.value = response.skuAlertCount
  adminAlertCount.value = response.adminAlertCount
}
await get()

function onSkuAlert() {
  alert('FIXME: rfukuma 在庫アラートを表示')
}
function onAdminAlert() {
  alert('FIXME: rfukuma 閾値アラートを表示')
}
</script>
