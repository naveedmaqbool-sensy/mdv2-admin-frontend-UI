/**
 * ページネーション関連のリクエスト
 */
interface PaginationRequest {
  page: number
  perPage: number
}

/**
 * ページネーション関係のレスポンス
 */
interface PaginationResponse<T> {
  data: T[]
  total: number
}

export { PaginationRequest, PaginationResponse }
