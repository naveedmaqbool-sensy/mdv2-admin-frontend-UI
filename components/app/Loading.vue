<template>
  <div
    v-show="showLoading"
    class="fixed left-0 top-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-800 bg-opacity-50"
  >
    <div
      class="absolute bottom-0 right-0 flex h-full w-full items-end justify-end pb-5 pr-7"
    >
      <svg
        class="mb-1 mr-2 h-4 w-4 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <div class="text-xl text-white">Now Loading</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppStateTypes from '~/types/enums/AppStateTypes'

const { throttle } = withDefaults(
  defineProps<{
    throttle?: number
  }>(),
  {
    throttle: 0,
  }
)

const isLoading = useState(AppStateTypes.isLoading, () => false)
const count = ref(0)
let timer: NodeJS.Timeout | null = null
watch(isLoading, (value) => {
  if (!throttle) return

  if (value) {
    timer = setInterval(() => {
      ++count.value
    })
  } else {
    count.value = 0
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }
})

const showLoading = computed(() => {
  return isLoading.value && count.value >= throttle
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped></style>
