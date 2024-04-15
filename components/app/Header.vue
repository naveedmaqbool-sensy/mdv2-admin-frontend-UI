<template>
  <header
    class="flex items-center bg-gradient-to-r from-pink-500 to-violet-400 py-2 pl-1 pr-4"
  >
    <a href="/" class="text-bold mb-[-2px] inline flex-1 text-slate-200">
      <img src="/img/logo.png" alt="sensy" class="inline-block h-8" />
      SENSY MD
    </a>
    <UButton color="gray" @click="logout"> ログアウト </UButton>
  </header>
</template>

<script setup lang="ts">
async function logout() {
  const { signOut } = useAuth()
  await signOut({
    redirect: false,
  })

  useRouter().push('/login')
}
</script>
