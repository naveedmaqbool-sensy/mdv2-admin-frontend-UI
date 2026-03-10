<template>
  <div class="flex min-h-screen bg-[#0B1727] font-sans">
    <!-- Left Panel (Brand) -->
    <div class="relative flex w-1/2 flex-col items-center justify-center">
      <div class="flex items-center justify-center p-8">
        <img
          src="/img/logo.png"
          alt="SENSY logo"
          class="w-64 max-w-[80%] object-contain"
        />
      </div>

      <!-- Center Divider Line -->
      <div
        class="absolute right-0 top-1/2 h-[60%] w-[1px] -translate-y-1/2 bg-slate-700"
      ></div>
    </div>

    <!-- Right Panel (Login Form) -->
    <div
      class="relative flex w-1/2 flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-sm space-y-10">
        <div class="text-center">
          <h2 class="text-3xl font-light tracking-wide text-white">Login</h2>
          <p
            class="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
          >
            Please login to Admin Dashboard.
          </p>
        </div>

        <UForm :state="{}" class="mt-8 space-y-6" @submit="login">
          <div class="space-y-4">
            <UFormGroup name="email">
              <UInput
                id="email-address"
                v-model="email"
                autocomplete="sensy-md-email"
                required
                placeholder="Username"
                size="xl"
                color="white"
                variant="none"
                class="rounded bg-white ring-1 ring-slate-200"
                :ui="{
                  base: 'w-full text-gray-900 placeholder-gray-400 text-sm',
                  rounded: 'rounded-none',
                  padding: { xl: 'px-4 py-3' },
                }"
              />
            </UFormGroup>
            <UFormGroup name="password">
              <UInput
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="sensy-md-password"
                required
                placeholder="Password"
                size="xl"
                color="white"
                variant="none"
                class="rounded bg-white ring-1 ring-slate-200"
                :ui="{
                  base: 'w-full text-gray-900 placeholder-gray-400 text-sm',
                  rounded: 'rounded-none',
                  padding: { xl: 'px-4 py-3' },
                  icon: { trailing: { pointer: '' } },
                }"
              >
                <template #trailing>
                  <UButton
                    color="gray"
                    variant="link"
                    :icon="
                      showPassword ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
                    "
                    :padded="false"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </UInput>
              <div class="mt-2 text-left">
                <a
                  href="https://sensy.ai/contact_service/"
                  target="_blank"
                  class="text-[10px] text-blue-500 transition-colors hover:text-blue-400"
                >
                  Forgot your password?
                </a>
              </div>
            </UFormGroup>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              class="w-full rounded bg-gradient-to-r from-pink-500 to-indigo-600 px-4 py-3 text-xs font-bold tracking-widest text-white shadow-md transition-all hover:opacity-90"
            >
              Sign In
            </button>
          </div>
        </UForm>
      </div>

      <!-- Bottom Right Links -->
      <div
        class="absolute bottom-8 right-8 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-slate-500"
      >
        <a
          href="https://sensy.ai/term_policies/"
          target="_blank"
          class="transition-colors hover:text-white"
          >Term-policies</a
        >
        <a
          href="https://sensy.ai/report/"
          target="_blank"
          class="transition-colors hover:text-white"
          >Report</a
        >
      </div>
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
const showPassword = ref(false)

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
