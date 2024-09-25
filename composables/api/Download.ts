import { saveAs } from 'file-saver'
import AppStateTypes from '~/types/enums/AppStateTypes'

export async function apiDownload<RequestT>(
  endpoint: string,
  request: RequestT
) {
  // ＡＰＩ発行
  const response = await apiPost<RequestT, Blob>(endpoint, request, 'blob', {
    500: 'データ量が多すぎる可能性があります。\n件数を絞ってもう一度お試しください。',
  })
  if (response === null) {
    return false
  }

  // レスポンスを file-saver が解釈できる blob の形式に変換
  const blob = new Blob([Uint8Array.from([0xef, 0xbb, 0xbf]), response], {
    type: 'application/octet-stream',
  })

  // API側からファイル名になりうる文字列を取得
  const contentDisposition = useState(
    AppStateTypes.ContentDisposition,
    () => null
  )

  // api からファイル名を取得できない場合
  const defaultFileName = 'noname'
  if (!contentDisposition.value) {
    saveAs(blob, defaultFileName)
    return true
  }

  // api からファイル名を取得している場合
  const fileName =
    parseDispotisionFileNameAsterisk(contentDisposition.value) ??
    parseDispotisionFileName(contentDisposition.value) ??
    defaultFileName
  saveAs(blob, fileName)

  // 保持しているファイル名を破棄a
  useState(AppStateTypes.ContentDisposition).value = null
  return true
}

function parseDispotisionFileName(contentDisposition: string) {
  const dispositions = contentDisposition.split(' ')

  const fileNames = dispositions
    .filter((v) => v.includes('filename='))
    .map((v) => v.split('=')[1])
  if (fileNames.length === 0) {
    return null
  }
  const fileName = fileNames[0]

  // ファイル名が取得でない場合は取得しない
  if (!fileName.split('.')[0]) {
    return null
  }
  return fileNames[0]
}

function parseDispotisionFileNameAsterisk(contentDisposition: string) {
  const dispositions = contentDisposition.split(' ')

  const fileNames = dispositions
    .filter((v) => v.includes('filename*='))
    .map((v) => v.split('=')[1])
  if (fileNames.length === 0) {
    return null
  }
  return fileNames[0].split("''")[1].replace("'", '')
}
