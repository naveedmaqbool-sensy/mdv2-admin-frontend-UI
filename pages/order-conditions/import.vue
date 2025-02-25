<template>
  <div>
    <CommonHeader title="発注条件マスタ 一括ＣＳＶ更新" />
    <UForm :state="{}">
      <CommonFileUploader
        v-model:upload-files="uploadFiles"
        :accept-types="[FileTypes.CSV]"
      />

      <div v-if="apiValidationError.exists('file')" class="text-red-500">
        <p
          v-for="(message, index) in apiValidationError.all().file"
          :key="index"
        >
          {{ message }}
        </p>
      </div>

      <UButton color="white" @click="reset">リセット</UButton>
      <UButton class="ml-2" color="indigo" @click="submit">更新</UButton>
      <UButton
        variant="link"
        class="ml-12"
        color="indigo"
        @click="downloadFormat"
      >
        フォーマットダウンロード
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type ApiValidationError from '~/types/classes/ApiValidationError'
import FileTypes from '~/types/enums/FileTypes'

const uploadFiles = ref<File[]>([])
const apiValidationError = ref<ApiValidationError>(
  serviceValidationErrorsInstance()
)

function reset() {
  uploadFiles.value = []
}

async function submit() {
  serviceLoadingStart()
  const response = await apiOrderConditionsCsvImport(uploadFiles.value)
  serviceLoadingFinish()

  apiValidationError.value.refresh()

  if (!response) {
    return
  }

  useNuxtApp().$toast.success('発注条件マスタを更新しました。')
}

async function downloadFormat() {
  serviceLoadingStart()
  await apiOrderConditionsDownloadFormat()
  serviceLoadingFinish()

  apiValidationError.value.refresh()
}
</script>

<style scoped></style>
