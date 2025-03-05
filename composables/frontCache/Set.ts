export const frontCacheSet = (
  key: string,
  value: any,
  isJson: boolean = false
) => {
  // TODO: rfukuma キャッシュ情報にバージョン情報を含めたほうがよくなったら対応する
  if (isJson) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    localStorage.setItem(key, value)
  }
}
