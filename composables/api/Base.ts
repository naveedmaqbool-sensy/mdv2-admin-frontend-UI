import AppStateTypes from '~/types/enums/AppStateTypes'
import type ValidationErrors from '~/types/interfaces/common/ValidationErrors'

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'
  | undefined

export type ErrorMessages = { [key: number]: string }

export async function apiBase<RequestT, ResponseT>(
  endpoint: string,
  request: RequestT,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  responseType: ResponseType = undefined,
  errorMessages: ErrorMessages | null = null,
  fileRequest: { [name: string]: File } | null = null
): Promise<ResponseT | null> {
  let params: any = null
  let body: any | null = null
  if (request) {
    if (method === 'GET' || method === 'DELETE') {
      // Date オブジェクトを渡した際にクォートされるのを避けるため
      params = request as any
      Object.keys(params).forEach((key) => {
        if (params[key] instanceof Date) {
          params[key] = params[key].toISOString()
        }
      })
    }
    if (method === 'POST' || method === 'PUT') {
      body = JSON.stringify(request) as any
    }
  }

  // ファイルの指定がある場合は FormData を使う
  if (fileRequest) {
    const formData = new FormData()
    Object.keys(fileRequest).forEach((key) => {
      formData.append(key, fileRequest[key])
    })
    if (body) {
      Object.keys(body).forEach((key) => {
        formData.append(key, body[key])
      })
    }
    body = formData
  }

  const config = {
    method,
    baseURL: useRuntimeConfig().public.apiUrl,
    headers: {
      // 認証情報（Bearer token）
      Authorization: useAuthState().token.value!,
      // Laravel を api と認識するために必須
      Accept: 'application/json',
      // Laravel のバリデーションを 422 で受けるのに必須
      'X-Requested-With': 'XMLHttpRequest',
    },
    params,
    body,
    server: false,
    responseType,
    onResponseError: (error: any) => {
      // const errorMessage = error.response._data.message
      const statusCode = error.response.status
      switch (statusCode) {
        case 403:
        case 401:
          // 権限エラーの場合はログイン画面に飛ばす
          if (location.href !== '/login') {
            location.href = '/login'
          }
          break
        case 422:
          // Laravel のバリデーションエラーを格納
          if (error.response._data.errors) {
            const apiValidationMessages: ValidationErrors = {}
            Object.keys(error.response._data.errors).forEach((key) => {
              apiValidationMessages[key] = error.response._data.errors[key]
            })
            const validationErrors: Ref<ValidationErrors> = useState(
              AppStateTypes.ValidationErrors
            )
            validationErrors.value = apiValidationMessages
          }
          return Promise.resolve(null)

        case 404:
        case 400:
        case 405:
        case 500:
          if (process.client) {
            useNuxtApp().$toast.error(
              errorMessages?.[statusCode] ?? '予期せぬエラーが発生しました。'
            )
          }
          break
        case 409:
          if (process.client) {
            useNuxtApp().$toast.error(
              errorMessages?.[statusCode] ??
                'データの重複があります。\n画面を再読み込みしてください。'
            )
          }
          break
      }

      return Promise.reject(error)
    },
    onResponse: (response: { response: Response }) => {
      const contentDisposition = response.response.headers.get(
        'Content-Disposition'
      )
      if (contentDisposition) {
        useState(AppStateTypes.ContentDisposition).value = contentDisposition
      }
      return response
    },
  }

  serviceValidationErrorsReset()

  // setup の場合は useFetch
  // それ以外の場合は $fetch
  if (process.server) {
    const response = await useFetch<ResponseT>(endpoint, config as any)
    return response.data.value as ResponseT
  } else {
    try {
      const response = await $fetch<ResponseT>(endpoint, config as any)
      return response
    } catch {
      return null
    }
  }
}
