import { saveAs } from 'file-saver'

export async function apiDownloadStorageBySignedUrl(
  signedUrl: string,
  fileName: string
): Promise<any> {
  const response = await $fetch<BlobPart>(signedUrl, {
    method: 'GET',
    responseType: 'blob',
  })

  // レスポンスを file-saver が解釈できる blob の形式に変換
  const blob = new Blob([Uint8Array.from([0xef, 0xbb, 0xbf]), response], {
    type: 'application/octet-stream',
  })

  saveAs(blob, fileName)
}
