export function apiOrderConditionsCsvImport(files: File[]) {
  return apiPost('/order-conditions/csv-import', null, undefined, null, {
    file: files[0],
  })
}
