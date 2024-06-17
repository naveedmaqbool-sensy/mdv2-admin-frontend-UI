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

  public exists(key?: string) {
    const keys = Object.keys(this.validationErrors)
    if (!key) {
      return keys.length > 0
    }

    return keys.includes(key)
  }

  public first(key: string) {
    if (!this.exists(key)) {
      return null
    }
    return this.validationErrors[key][0]
  }

  public refresh() {
    this.validationErrors = useState(
      AppStateTypes.ValidationErrors,
      () => ({})
    ).value
  }
}
