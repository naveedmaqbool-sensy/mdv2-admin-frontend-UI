import AppStateTypes from '~/types/enums/AppStateTypes'

export const serviceLoadingToggleIgnore = () => {
  if (process.client) {
    const isIgnoreLoading = useState(AppStateTypes.ignoreLoading, () => false)
    isIgnoreLoading.value = !isIgnoreLoading.value
  }
}
