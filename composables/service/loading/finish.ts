import AppStateTypes from '~/types/enums/AppStateTypes'

export const serviceLoadingFinish = () => {
  if (process.client) {
    const isLoading = useState(AppStateTypes.isLoading, () => false)
    isLoading.value = false
  }
}
