export function apiUploadStorageBySignedUrl(
  signedUrl: string,
  file: File
): Promise<any> {
  return $fetch(signedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })
}
