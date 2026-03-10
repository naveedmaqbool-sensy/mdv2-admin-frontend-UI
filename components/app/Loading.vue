<template>
  <div
    v-show="showLoading"
    class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
  >
    <div
      class="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-2xl"
    >
      <svg
        class="mb-4 h-10 w-10 animate-spin text-pink-500"
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
      <div class="text-lg font-semibold tracking-wider text-gray-700">
        Loading...
      </div>
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
  if (useState(AppStateTypes.ignoreLoading).value) return false
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
