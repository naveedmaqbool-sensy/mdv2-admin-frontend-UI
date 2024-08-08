export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (_error, _instance, _info) => {
    // eslint-disable-next-line no-console
    console.info('nuxtApp.vueApp.config.errorHandler')
    // FIXME: rfukuma エラーハンドリングするならここ？
    // handle error, e.g. report to a service
  }

  // Also possible
  nuxtApp.hook('vue:error', (_error, _instance, _info) => {
    // eslint-disable-next-line no-console
    console.info('nuxtApp.hook.vue:error')
    // FIXME: rfukuma エラーハンドリングするならここ？
    // handle error, e.g. report to a service
  })
})
