export const frontCacheRemove = (key: string) => {
  // TODO: rfukuma キャッシュ情報にバージョン情報を含めたほうがよくなったら対応する
  localStorage.removeItem(key)
}
