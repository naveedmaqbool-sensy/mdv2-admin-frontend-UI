<template>
  <div>
    <CommonHeader title="閾値アラート" />

    <UForm :state="{}">
      <section class="rounded border border-gray-300 p-4">
        <div class="flex flex-row">
          <div class="my-auto basis-1/12">
            <label class="whitespace-nowrap pr-2 text-right font-bold">
              対象期間
            </label>
          </div>
          <div class="basis-2/12">
            <CommonDatepicker v-model="request.from" />
          </div>
          <div class="my-auto px-2">～</div>
          <div class="basis-2/12">
            <CommonDatepicker v-model="request.to" />
          </div>
        </div>
      </section>
      <section class="pt-2">
        <UButton color="white" @click="reset">リセット</UButton>
        <UButton class="ml-2" color="indigo" @click="get">確認</UButton>
      </section>
    </UForm>

    <div class="pt-2">
      <UButton color="white" @click="back">戻る</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThresholdAlertFetchRequestFactory } from '~/composables/api/thresholdAlert/Fetch'
import AppStateTypes from '~/types/enums/AppStateTypes'
import type FormData from '~/types/interfaces/page/alert/FormData'
import FormDataFactory from '~/types/interfaces/page/alert/FormDataFactory'

const formData =
  servicePersistentStateGet<FormData>(AppStateTypes.AlertFormData, {
    from: (value: string | null) => (value ? new Date(value) : null),
    to: (value: string | null) => (value ? new Date(value) : null),
  }) || new FormDataFactory()
const request = ref({
  ...new ThresholdAlertFetchRequestFactory(),
  from: formData.from,
  to: formData.to,
})

async function reset() {
  request.value = new ThresholdAlertFetchRequestFactory()
  await get()
}

async function get() {
  serviceLoadingStart()
  const response = await apiThresholdAlertFetch(request.value)
  serviceLoadingFinish()
  if (!response) {
    return
  }

  // 検索条件をブラウザに保持する
  servicePersistentStateSet(AppStateTypes.AlertFormData, request.value)
}
await get()

function back() {
  useRouter().back()
}
</script>

<style scoped></style>
