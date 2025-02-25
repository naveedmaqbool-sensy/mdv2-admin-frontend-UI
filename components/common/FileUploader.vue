<template>
  <div
    class="my-2 flex cursor-pointer flex-col items-center rounded border-2 border-dashed border-gray-300 p-4"
    :class="{
      'bg-gray-100': isDragActive,
    }"
    v-bind="getRootProps()"
  >
    <input v-bind="getInputProps()" />
    <section class="py-10 text-center text-gray-500">
      <p class="text-lg font-bold">
        <UIcon name="i-heroicons-arrow-up-tray-solid" class="mr-2 mt-2" />
        ファイルアップロード
      </p>
      <p v-if="uploadFiles.length === 0">
        ファイルをドラッグ &
        ドロップするか、クリックしてファイルを選択してください。
      </p>
      <p v-else>
        <UCard
          v-for="(uploadFile, index) in uploadFiles"
          :key="index"
          class="cursor-default"
          @click.prevent.stop=""
        >
          <div class="flex items-center">
            <UIcon class="text-2xl" name="i-heroicons-document-text-16-solid" />
            <span class="ml-2">{{ uploadFile.name }}</span>
            <UButton variant="link" color="red" @click="removeFile(index)">
              <UIcon class="text-xl" name="i-heroicons-x-mark-16-solid" />
            </UButton>
          </div>
          <UBadge color="white">{{ uploadFile.type }}</UBadge>
          <UBadge color="white" class="ml-2">
            {{ formatterNumber(uploadFile.size) }} bytes
          </UBadge>
        </UCard>
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useDropzone, type FileRejectReason } from 'vue3-dropzone'
import FileTypes from '~/types/enums/FileTypes'

const uploadFiles = defineModel<File[]>('uploadFiles', {
  type: Array,
  required: true,
})

const { acceptTypes } = withDefaults(
  defineProps<{ acceptTypes: FileTypes[] }>(),
  {}
)

function onDrop(
  acceptFiles: File[],
  _rejectReasons: FileRejectReason[],
  _event: Event
) {
  if (acceptFiles.length === 0) {
    return
  }

  const isAccept = acceptTypes
    .map((v) => FileTypes.getAcceptMimeTypes(v))
    .some((v) => {
      return acceptFiles.every((f) => v.includes(f.type))
    })
  if (!isAccept) {
    useNuxtApp().$toast.error(
      acceptFiles.values.length > 1
        ? 'アップロードできないファイル形式が選択されました。'
        : FileTypes.getAcceptFileName(acceptTypes[0]) + 'を選択してください。'
    )
    return
  }
  uploadFiles.value = acceptFiles
}

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
})

function removeFile(index: number) {
  uploadFiles.value.splice(index, 1)
}
</script>

<style scoped></style>
