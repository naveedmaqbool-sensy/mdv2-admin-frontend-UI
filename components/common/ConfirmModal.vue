<template>
  <UModal v-model="show">
    <UCard
      :ui="{
        ring: '',
      }"
    >
      <template #header>
        <h1 class="text-lg font-bold">{{ title }}</h1>
      </template>

      <slot name="body">本当に実行しますか？</slot>

      <template #footer>
        <div class="flex flex-row">
          <div class="basis-3/4 justify-start"></div>
          <div class="basis-1/4 text-right">
            <UButton color="gray" label="いいえ" @click="show = false" />
            <UButton
              color="primary"
              class="ml-2"
              label="はい"
              @click="emit('submit')"
            />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const show = defineModel({
  required: true,
  type: Boolean,
})
const emit = defineEmits<{ submit: [] }>()
const { title } = withDefaults(defineProps<{ title?: string }>(), {
  title: '確認',
})
</script>
