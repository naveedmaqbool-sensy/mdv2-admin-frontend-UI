import ApiValidationError from '~/types/classes/ApiValidationError'

export const serviceValidationErrorsInstance = () => {
  return new ApiValidationError()
}
