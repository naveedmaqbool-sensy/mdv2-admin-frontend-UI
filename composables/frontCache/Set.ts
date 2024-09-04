export const frontCacheSet = (
  key: string,
  value: any,
  isJson: boolean = false
) => {
  if (isJson) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
}
