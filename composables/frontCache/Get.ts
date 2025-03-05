export const frontCacheGet = (key: string, isJson: boolean = false) => {
  // TODO: rfukuma キャッシュ情報にバージョン情報を含めたほうがよくなったら対応する
  const result = localStorage.getItem(key)
  if (result === null || !isJson) {
    return result
  }
  return JSON.parse(result)
}
