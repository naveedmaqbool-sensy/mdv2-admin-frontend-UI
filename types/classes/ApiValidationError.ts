import AppStateTypes from '~/types/enums/AppStateTypes'
import type ValidationErrors from '~/types/interfaces/common/ValidationErrors'

export interface ApiValidationErrorInterface {
  exists(key?: string): boolean
  all(): ValidationErrors
  first(key: string): string | null
}

export default class ApiValidationError implements ApiValidationErrorInterface {
  private validationErrors!: ValidationErrors

  constructor() {
    this.refresh()
  }

  public all() {
    return this.validationErrors
  }

  public exists(key?: string | string[]) {
    const keys = Object.keys(this.validationErrors)
    if (!key) {
      return keys.length > 0
    }
    if (Array.isArray(key)) {
      return keys.some((k) => key.includes(k))
    }

    return keys.includes(key)
  }

  public first(key: string) {
    if (!this.exists(key)) {
      return null
    }
    return this.validationErrors[key][0]
  }

  public get(key: string | string[]) {
    if (Array.isArray(key)) {
      return key
        .map((v) => this.validationErrors[v])
        .filter((v) => !!v)
        .map((v) => v[0])
    }

    return this.validationErrors[key]
  }

  public refresh() {
    this.validationErrors = useState(
      AppStateTypes.ValidationErrors,
      () => ({})
    ).value
  }

  public set(key: string, message: string) {
    this.validationErrors[key] = [message]
  }
}
