<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
  >
    <div class="mt-[-10rem] w-full max-w-md space-y-6">
      <UForm class="space-y-3" @submit="login">
        <UFormGroup label="メールアドレス" name="email">
          <UInput
            id="email-address"
            v-model="email"
            type="email"
            autocomplete="sensy-md-email"
            required
            placeholder="メールアドレス"
          />
        </UFormGroup>
        <UFormGroup label="パスワード" name="password">
          <UInput
            id="password"
            v-model="password"
            type="password"
            autocomplete="sensy-md-password"
            required
            placeholder="パスワード"
          />
        </UFormGroup>

        <UButton
          icon="i-heroicons-lock-closed"
          size="sm"
          color="indigo"
          variant="solid"
          label="ログイン"
          block
          type="submit"
        />
      </UForm>
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
const email = ref('satoshi.yoneyama@sensy.ai')
const password = ref('password')

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
