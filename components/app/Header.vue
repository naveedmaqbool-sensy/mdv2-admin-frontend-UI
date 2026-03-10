<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between border-b-2 border-indigo-600/90 bg-white px-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] sm:px-12 md:px-24"
  >
    <div class="flex items-center gap-5">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 text-xl font-extrabold tracking-tight text-gray-900 transition-all duration-200 hover:opacity-80"
      >
        <img
          src="/img/logo.png"
          alt="SENSY logo"
          class="h-7 w-auto brightness-110 drop-shadow-sm grayscale-[30%]"
        />
        <span
          class="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
          >SENSY MD</span
        >
      </NuxtLink>

      <UButton
        v-if="status !== 'unauthenticated'"
        color="gray"
        variant="ghost"
        icon="i-heroicons-bars-3-bottom-left"
        class="ml-2 rounded-lg px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        @click="onMenuClick"
      >
        <span class="hidden sm:inline-block">メニュー</span>
      </UButton>
    </div>

    <div class="flex items-center gap-5">
      <div
        v-if="status !== 'unauthenticated'"
        class="hidden items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 shadow-inner ring-1 ring-gray-200 lg:flex"
      >
        <div class="relative flex h-2 w-2">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
          ></span>
          <span
            class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          ></span>
        </div>
        <span class="text-xs font-semibold tracking-wide text-gray-600">
          システム管理者
        </span>
      </div>

      <UButton
        v-if="status !== 'unauthenticated'"
        color="gray"
        variant="soft"
        icon="i-heroicons-arrow-right-start-on-rectangle"
        class="rounded-lg px-4 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-200 hover:text-gray-900"
        @click="logout"
      >
        <span class="hidden sm:inline-block">ログアウト</span>
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const { status } = useAuth()
const emit = defineEmits(['onMenuClick'])

async function logout() {
  const { signOut } = useAuth()
  await signOut({
    redirect: false,
  })

  useRouter().push('/login')
}

function onMenuClick() {
  emit('onMenuClick')
}
</script>
