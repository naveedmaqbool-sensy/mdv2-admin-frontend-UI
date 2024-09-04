<template>
  <header
    class="flex items-center bg-gradient-to-r from-pink-500 to-violet-400 py-2 pl-1 pr-4"
  >
    <div class="flex-1">
      <div class="inline-block w-44">
        <a href="/" class="text-bold mb-[-2px] inline text-slate-200">
          <img src="/img/logo.png" alt="sensy" class="inline-block h-8" />
          SENSY MD
        </a>
      </div>
      <UButton
        v-if="status !== 'unauthenticated'"
        color="gray"
        @click="onMenuClick"
      >
        メニュー
      </UButton>
    </div>
    <UButton v-if="status !== 'unauthenticated'" color="gray" @click="logout">
      ログアウト
    </UButton>
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
