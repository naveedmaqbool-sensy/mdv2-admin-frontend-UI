const apiUrl = process.env.API_URL || 'http://localhost:8000'
const meta = []

// noindex 対応
if (
  [undefined, 'develop', 'production', 'staging'].includes(
    process.env.ENVIRONMENT
  )
) {
  meta.push({
    name: 'robots',
    content: 'noindex, nofollow',
  })
}

const basicAuthUsername = process.env.BASIC_AUTH_USERNAME
const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD

const basicAuth: {
  enabled: boolean
  users: { username: string; password: string }[]
} = {
  enabled: false,
  users: [],
}
const hasBasicAuth = basicAuthUsername && basicAuthPassword
if (hasBasicAuth) {
  basicAuth.enabled = true
  basicAuth.users.push({
    username: basicAuthUsername,
    password: basicAuthPassword,
  })
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl,
    },
  },
  $production: {},
  $development: {},
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: process.env.APP_NAME,
      meta,
    },
  },
  imports: {
    dirs: ['composables/**/*.ts', 'types/**/*.d.ts'],
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/eslint-module',
    // '@nuxtjs/tailwindcss',
    '@kgierke/nuxt-basic-auth',
    '@sidebase/nuxt-auth',
  ],
  build: {
    transpile: ['jsonwebtoken'],
  },
  tailwindcss: {
    // Options
  },
  basicAuth,
  auth: {
    baseURL: `${apiUrl}/auth`,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        getSession: { path: '/me', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/accessToken',
        type: 'Bearer',
      },
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
  },
})
