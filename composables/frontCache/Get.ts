export const frontCacheGet = (key: string, isJson: boolean = false) => {
  const result = localStorage.getItem(key)
  if (result === null || !isJson) {
    return result
  }
  return JSON.parse(result)
}
