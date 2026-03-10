<template>
  <header
    class="flex h-16 shrink-0 items-center justify-between bg-gradient-to-r from-pink-500 to-indigo-600 px-24 shadow-md"
  >
    <div class="flex items-center gap-6">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
      >
        <img src="/img/logo.png" alt="SENSY logo" class="h-8 w-auto" />
        SENSY MD
      </NuxtLink>

      <UButton
        v-if="status !== 'unauthenticated'"
        color="white"
        variant="ghost"
        icon="i-heroicons-bars-3"
        class="text-white ring-1 ring-white/20 hover:bg-white/20"
        @click="onMenuClick"
      >
        メニュー
      </UButton>
    </div>

    <div class="flex items-center gap-4">
      <span
        v-if="status !== 'unauthenticated'"
        class="text-sm font-medium text-white/80"
      >
        システム管理者
      </span>
      <UButton
        v-if="status !== 'unauthenticated'"
        color="white"
        variant="solid"
        icon="i-heroicons-arrow-right-on-rectangle"
        class="shadow-sm"
        @click="logout"
      >
        ログアウト
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
