import AppStateTypes from '~/types/enums/AppStateTypes'
import type ValidationErrors from '~/types/interfaces/common/ValidationErrors'

export const serviceValidationErrorsAll = () => {
  const validationErrors: Ref<ValidationErrors> = useState(
    AppStateTypes.ValidationErrors,
    () => ({})
  )
  return validationErrors.value
}
