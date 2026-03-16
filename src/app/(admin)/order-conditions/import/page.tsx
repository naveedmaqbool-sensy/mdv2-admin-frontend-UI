'use client'

import { useState } from 'react'
import { Upload, Download, RotateCcw, CheckCircle } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { uploadOrderConditionsCsv } from '@/lib/api/endpoints'

export default function OrderConditionsImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.endsWith('.csv')) {
        setError('CSVファイルを選択してください。')
        setFile(null)
        return
      }
      setError(null)
      setFile(selected)
    }
  }

  function handleReset() {
    setFile(null)
    setError(null)
    setSuccess(null)
    // Clear file input
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  async function handleSubmit() {
    if (!file) {
      setError('ファイルが選択されていません。')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await uploadOrderConditionsCsv(file)
      if (response && response.errorCount === 0) {
        setSuccess('発注条件マスタを更新しました。')
        setFile(null) // Reset after success
      } else {
        setError(response?.message || 'アップロード中にエラーが発生しました。')
      }
    } catch (err: any) {
      setError(err.message || 'アップロードに失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadFormat() {
    // Note: To match Vue's `apiOrderConditionsDownloadFormat`
    console.log("Downloading CSV Format...")
    // In a real implementation this would trigger an apiDownload endpoint
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader title="発注条件マスタ 一括ＣＳＶ更新" subtitle="CSVファイルをアップロードして発注条件を一括更新します" />

      {error && <div className="rounded-lg bg-red-50 p-4 font-medium text-red-800 ring-1 ring-inset ring-red-200">{error}</div>}
      {success && <div className="rounded-lg bg-emerald-50 p-4 font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">{success}</div>}

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        
        <div className="flex flex-col items-center justify-center p-8">
          <label 
            htmlFor="csv-upload"
            className={`flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16 transition-all ${
              file ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-gray-100'
            }`}
          >
            {file ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-indigo-600" />
                </div>
                <p className="text-lg text-gray-900">{file.name}</p>
                <p className="mt-2 text-base text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                <p className="mt-4 text-base font-medium text-indigo-600">クリックして別のファイルを選択</p>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-lg text-gray-900">ファイルを選択、またはドラッグ＆ドロップ</p>
                <p className="mt-2 text-base text-gray-500">CSVファイルのみ対応</p>
              </>
            )}
            <input 
              id="csv-upload" 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>

          <div className="mt-8 flex items-center justify-between w-full max-w-xl">
            <button
              onClick={handleDownloadFormat}
              className="inline-flex items-center gap-2 text-base text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Download className="h-4 w-4" />
              フォーマットをダウンロード
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-base text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-base text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            更新する
          </button>
        </div>

      </div>
    </div>
  )
}
