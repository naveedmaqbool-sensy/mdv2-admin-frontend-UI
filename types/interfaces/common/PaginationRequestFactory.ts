import type { PaginationRequest } from './Pagination'

export default class PaginationReqeustFactory implements PaginationRequest {
  page!: number
  perPage!: number

  public constructor() {
    this.page = 1
    this.perPage = 20
  }

  public all() {
    this.page = 1
    this.perPage = -1
    return this
  }
}
