import AppStateTypes from '~/types/enums/AppStateTypes'
import type ValidationErrors from '~/types/interfaces/common/ValidationErrors'

export const serviceValidationErrorsReset = () => {
  const validationErrors: Ref<ValidationErrors> = useState(
    AppStateTypes.ValidationErrors,
    () => ({})
  )
  validationErrors.value = {}
}
