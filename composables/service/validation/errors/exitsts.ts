import AppStateTypes from '~/types/enums/AppStateTypes'
import type ValidationErrors from '~/types/interfaces/common/ValidationErrors'

export const serviceValidationErrorsExists = () => {
  const validationErrors: Ref<ValidationErrors> = useState(
    AppStateTypes.ValidationErrors,
    () => ({})
  )
  return Object.keys(validationErrors.value).length > 0
}
