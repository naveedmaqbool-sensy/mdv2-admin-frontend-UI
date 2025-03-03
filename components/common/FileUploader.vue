<template>
  <div
    class="my-2 flex cursor-pointer flex-col items-center rounded border-2 border-dashed border-gray-300 p-4"
    :class="{
      'bg-gray-100': isDragActive,
    }"
    v-bind="getRootProps()"
  >
    <input v-bind="getInputProps()" />
    <section class="text-center text-gray-500">
      <p v-if="uploadFiles.length === 0" class="my-10 text-lg font-bold">
        <UIcon name="i-heroicons-arrow-up-tray-solid" class="mr-2 mt-2" />
        ファイルアップロード
      </p>
      <p v-if="uploadFiles.length > 0">
        <UCard
          v-for="(uploadFile, index) in uploadFiles"
          :key="index"
          class="cursor-default"
          @click.prevent.stop=""
        >
          <div class="flex items-center">
            <UIcon class="text-2xl" name="i-heroicons-document-text-16-solid" />
            <span class="ml-2 text-xs">{{ uploadFile.file.name }}</span>
            <UButton variant="link" color="red" @click="removeFile(index)">
              <UIcon class="text-xl" name="i-heroicons-x-mark-16-solid" />
            </UButton>
          </div>
          <UBadge color="white">{{ uploadFile.file.type }}</UBadge>
          <UBadge color="white" class="ml-2">
            {{ formatterNumber(uploadFile.lineLength) }} 行
          </UBadge>
          <UBadge v-if="uploadFile.file.size < 1024" color="white" class="ml-2">
            {{ formatterNumber(uploadFile.file.size) }} Byte
          </UBadge>
          <UBadge
            v-else-if="uploadFile.file.size < 1024 * 1024"
            color="white"
            class="ml-2"
          >
            {{ formatterNumber(uploadFile.file.size / 1024) }} KB
          </UBadge>
          <UBadge v-else color="white" class="ml-2">
            {{ formatterNumber(uploadFile.file.size / (1024 * 1024)) }} MB
          </UBadge>
        </UCard>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDropzone, type FileRejectReason } from 'vue3-dropzone'
import FileTypes from '~/types/enums/FileTypes'

const uploadFiles = defineModel<{ file: File; lineLength: number }[]>(
  'uploadFiles',
  {
    type: Array,
    required: true,
  }
)

const { acceptTypes, fileSizeLimit, useHeader } = withDefaults(
  defineProps<{
    acceptTypes: FileTypes[]
    fileSizeLimit: number
    useHeader: boolean
  }>(),
  {
    fileSizeLimit: 100 * 1024 * 1024, // 100MB
    useHeader: true,
  }
)

function onDrop(
  acceptFiles: File[],
  _rejectReasons: FileRejectReason[],
  _event: Event
) {
  if (acceptFiles.length === 0) {
    return
  }

  const isAcceptMimeType = acceptTypes
    .map((v) => FileTypes.getAcceptMimeTypes(v))
    .every((v) => {
      return acceptFiles.every((f) => v.includes(f.type))
    })
  if (!isAcceptMimeType) {
    useNuxtApp().$toast.error(
      acceptFiles.values.length > 1
        ? 'アップロードできないファイル形式が選択されました。'
        : FileTypes.getAcceptFileName(acceptTypes[0]) + 'を選択してください。'
    )
    return
  }

  const isAcceptFileSize = acceptFiles.every((f) => f.size <= fileSizeLimit)
  if (!isAcceptFileSize) {
    useNuxtApp().$toast.error(
      formatterNumber(fileSizeLimit / (1024 * 1024)) +
        'MB以下のファイルを選択してください。'
    )
    return
  }

  uploadFiles.value = acceptFiles.map((file) => ({
    file,
    lineLength: useHeader ? -1 : 0,
  }))
  acceptFiles.forEach((file, index) => {
    getLineLength(file, index)
  })
}

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
})

function removeFile(index: number) {
  uploadFiles.value.splice(index, 1)
}

/**
 * ファイルサイズの計算
 * @param file File オブジェクト
 * @param index ファイルの要素数
 */
function getLineLength(file: File, index: number) {
  let reminder = ''
  const stream = file.stream()
  const reader = stream.getReader()
  reader.read().then(function processResult(
    result: ReadableStreamReadResult<Uint8Array<ArrayBufferLike>>
  ): Promise<ReadableStreamReadResult<Uint8Array<ArrayBufferLike>> | void> {
    // 読み取り完了
    if (result.done) {
      return Promise.resolve()
    }

    // 取得できた文字列分だけ行数をカウント
    const textDecoder = new TextDecoder('utf-8')
    const chunk = textDecoder.decode(result.value, { stream: true })
    const parts = (reminder + chunk).split('\n')
    reminder = parts.pop() || ''
    uploadFiles.value[index].lineLength += parts.filter((v) => v).length
    return reader.read().then(processResult)
  })
}
</script>

<style scoped></style>
