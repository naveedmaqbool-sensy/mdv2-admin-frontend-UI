import type AppStateTypes from '~/types/enums/AppStateTypes'

export function servicePersistentStateSet<T>(key: AppStateTypes, value: T) {
  if (process.client) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
