import AppStateTypes from '~/types/enums/AppStateTypes'

export const serviceLoadingStart = () => {
  if (process.client) {
    const isLoading = useState(AppStateTypes.isLoading, () => false)
    isLoading.value = true
  }
}
