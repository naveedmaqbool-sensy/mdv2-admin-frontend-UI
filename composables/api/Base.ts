import AppStateTypes from '~/types/enums/AppStateTypes'
import type ValidationErrors from '~/types/interfaces/common/ValidationErrors'

export async function apiBase<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
): Promise<ResponseT | null> {
  // 設定を作成
  const config = {
    method,
    baseURL: useRuntimeConfig().public.apiUrl,
    headers: {
      // 認証情報（Bearer token）
      Authorization: useAuthState().token.value!,
      // Laravel を api と認識するために必須
      'Content-Type': 'application/json',
      // Laravel のバリデーションを 422 で受けるのに必須
      'X-Requested-With': 'XMLHttpRequest',
    },
    params: null,
    body: null,
    ssr: false,
  }
  if (method === 'GET' || method === 'DELETE') {
    // Date オブジェクトを渡した際にクォートされるのを避けるため
    const params = request as any
    Object.keys(params).forEach((key) => {
      if (params[key] instanceof Date) {
        params[key] = params[key].toISOString()
      }
    })
    config.params = params
  }
  if (method === 'POST' || method === 'PUT') {
    config.body = request as any
  }

  serviceValidationErrorsReset()

  // 通信発行
  const response = await useFetch<ResponseT>(endpoint, config as any)

  // エラー処理
  if (response.status.value !== 'success') {
    const { statusCode } = response.error.value!
    switch (statusCode) {
      case 422:
        // Laravel のバリデーションエラーを格納
        if (response.error.value?.data.errors) {
          const apiValidationMessages: ValidationErrors = {}
          Object.keys(response.error.value?.data.errors).forEach((key) => {
            apiValidationMessages[key] = response.error.value?.data.errors[key]
          })
          const validationErrors: Ref<ValidationErrors> = useState(
            AppStateTypes.ValidationErrors
          )
          validationErrors.value = apiValidationMessages
        }
        return Promise.resolve(null)

      case 400:
      case 404:
      case 405:
      case 500:
        showError({
          statusCode,
        })
        break
    }
    return Promise.reject(response.error)
  }

  // 通常レスポンス返却
  return response.data.value as ResponseT
}
