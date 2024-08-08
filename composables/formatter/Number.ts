export const formatterNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) return ''

  return value!.toLocaleString()
}
