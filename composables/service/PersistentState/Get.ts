import type AppStateTypes from '~/types/enums/AppStateTypes'

export function servicePersistentStateGet<T>(
  key: AppStateTypes,
  convertFunctions: { [key: string]: CallableFunction } = {},
  convertResponse: CallableFunction | null = null
): T | null {
  if (process.client) {
    const value = localStorage.getItem(key)

    // 文字列 undefined があったため
    if (value === 'undefined' || !value) return null

    // それぞれのカラムの変換処理
    const result = JSON.parse(value)
    const convertKeys = Object.keys(convertFunctions)

    convertKeys.forEach((key) => {
      result[key] = convertFunctions[key](result[key])
    })

    return convertResponse ? convertResponse(result) : result
  }
  return null
}
