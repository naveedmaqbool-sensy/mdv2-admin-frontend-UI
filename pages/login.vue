<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <div class="mt-[-10rem] w-full max-w-sm">
      <UCard
        :ui="{ ring: 'ring-1 ring-gray-200', shadow: 'shadow-xl rounded-2xl' }"
      >
        <template #header>
          <div class="flex flex-col items-center justify-center space-y-1 py-4">
            <h1
              class="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent"
            >
              SENSY MD
            </h1>
            <p class="text-xs font-medium tracking-wider text-gray-400">
              BUSINESS PORTAL
            </p>
          </div>
        </template>

        <UForm :state="{}" class="space-y-5" @submit="login">
          <UFormGroup label="ログインＩＤ" name="email">
            <UInput
              id="email-address"
              v-model="email"
              autocomplete="sensy-md-email"
              required
              placeholder="System Admin ID"
              icon="i-heroicons-user"
              size="md"
            />
          </UFormGroup>
          <UFormGroup label="パスワード" name="password">
            <UInput
              id="password"
              v-model="password"
              type="password"
              autocomplete="sensy-md-password"
              required
              placeholder="Password"
              icon="i-heroicons-key"
              size="md"
            />
          </UFormGroup>

          <UButton
            icon="i-heroicons-arrow-right-end-on-rectangle"
            size="md"
            color="indigo"
            variant="solid"
            label="ログイン"
            block
            type="submit"
            class="mt-6"
          />
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-login',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const environment = useNuxtApp().$config.public.environment
const isDevelop = ['local', 'develop', 'staging'].includes(environment)
const email = ref(isDevelop ? 'system-admin' : '')

const password = ref(isDevelop ? 'password' : '')

const { signIn, status } = useAuth()

async function login() {
  if (!email.value || !password.value) return

  try {
    serviceLoadingStart()
    await signIn(
      {
        username: email.value,
        password: password.value,
      },
      {
        redirect: false,
      }
    )
  } catch {
    useNuxtApp().$toast.error('ログインに失敗しました。')
    serviceLoadingFinish()
  }

  if (status.value === 'authenticated') {
    await useRouter().push('/')
    serviceLoadingFinish()
  }
}
</script>

<style scoped></style>
