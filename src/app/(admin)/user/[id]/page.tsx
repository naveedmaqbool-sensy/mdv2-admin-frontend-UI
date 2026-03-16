'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import { fetchUser, createUser, updateUser, User } from '@/lib/api/endpoints'
import { getUserPermissionTypeOptions, UserPermissionType } from '@/types/enums'

export default function UserEditPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const isCreate = userId === 'create'

  const [user, setUser] = useState<Partial<User> & { password?: string; confirmPassword?: string }>({
    employeeId: '',
    name: '',
    email: '',
    permission: UserPermissionType.General,
    isActive: true,
    password: '',
    confirmPassword: '',
    stores: [],
    departments: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function loadUser() {
    setLoading(true)
    const data = await fetchUser(userId)
    setLoading(false)
    if (data) {
      setUser({ ...data, password: '', confirmPassword: '' })
    }
  }

  useEffect(() => {
    if (!isCreate) {
      loadUser()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!isCreate) {
      if (!user.employeeId?.trim()) errs.employeeId = '社員番号は必須です。'
      if (!user.name?.trim()) errs.name = '氏名は必須です。'
      if (user.password && user.password !== user.confirmPassword) errs.password = 'パスワードが一致しません。'
    } else {
      if (!user.email?.trim()) errs.email = 'メールアドレスは必須です。'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    const payload = { ...user }
    delete payload.confirmPassword
    if (!payload.password) delete payload.password

    let response
    if (isCreate) {
      response = await createUser(payload)
    } else {
      response = await updateUser(userId, payload)
    }
    setSaving(false)

    if (response) {
      router.push('/user')
    }
  }

  function updateField(key: string, value: string | number | boolean | unknown[]) {
    setUser(prev => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader title={isCreate ? 'ユーザー登録' : 'ユーザー編集'} />

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="max-w-2xl space-y-6">
          {/* メールアドレス - Always show */}
          <FormRow label="メールアドレス" required={isCreate} error={errors.email}>
            <input
              type="email"
              value={user.email || ''}
              onChange={e => updateField('email', e.target.value)}
              className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </FormRow>

          {isCreate && (
            <div className="rounded-lg bg-blue-50 p-4 text-base text-blue-700 mt-4 border border-blue-100">
              <span className="font-bold block mb-1">招待メールの送信</span>
              登録したメールアドレスに招待メールが直接送信されます。氏名、パスワード、および権限の詳細設定は、ユーザーがアカウント作成を完了した後に編集可能になります。
            </div>
          )}

          {!isCreate && (
            <>
              {/* 社員番号 */}
              <FormRow label="社員番号" required error={errors.employeeId}>
                <input
                  type="text"
                  value={user.employeeId || ''}
                  onChange={e => updateField('employeeId', e.target.value)}
                  className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </FormRow>

              {/* 氏名 */}
              <FormRow label="氏名" required error={errors.name}>
                <input
                  type="text"
                  value={user.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </FormRow>

              {/* パスワード */}
              <FormRow label="パスワード" error={errors.password}>
                <input
                  type="password"
                  value={user.password || ''}
                  onChange={e => updateField('password', e.target.value)}
                  placeholder="変更する場合のみ入力"
                  className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </FormRow>

              {/* 確認用パスワード */}
              <FormRow label="確認用パスワード">
                <input
                  type="password"
                  value={user.confirmPassword || ''}
                  onChange={e => updateField('confirmPassword', e.target.value)}
                  className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </FormRow>

              {/* 権限 */}
              <FormRow label="権限" required>
                <select
                  value={user.permission}
                  onChange={e => updateField('permission', Number(e.target.value))}
                  className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {getUserPermissionTypeOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormRow>

              {/* 有効区分 */}
              <FormRow label="有効区分" required>
                <select
                  value={user.isActive ? 'true' : 'false'}
                  onChange={e => updateField('isActive', e.target.value === 'true')}
                  className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="true">有効</option>
                  <option value="false">無効</option>
                </select>
              </FormRow>

              {/* 所属店舗 */}
              <FormRow label="所属店舗">
                <div className="flex flex-wrap gap-2">
                  {(user.stores ?? []).length > 0 ? (
                    user.stores!.map((store, i) => (
                      <span key={store.storeId} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                        {store.storeName}
                        <button
                          onClick={() => {
                            const next = [...user.stores!]
                            next.splice(i, 1)
                            updateField('stores', next)
                          }}
                          className="ml-0.5 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-base text-gray-400">未設定</span>
                  )}
                </div>
              </FormRow>

              {/* 所属部門 */}
              <FormRow label="所属部門">
                <div className="flex flex-wrap gap-2">
                  {(user.departments ?? []).length > 0 ? (
                    user.departments!.map((dept, i) => (
                      <span key={dept.departmentId} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                        {dept.departmentName}
                        <button
                          onClick={() => {
                            const next = [...user.departments!]
                            next.splice(i, 1)
                            updateField('departments', next)
                          }}
                          className="ml-0.5 text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-base text-gray-400">未設定</span>
                  )}
                </div>
              </FormRow>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-base text-gray-700 shadow-sm transition-all hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          戻る
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-base text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isCreate ? '招待を送信' : '保存'}
        </button>
      </div>
    </div>
  )
}

// Helper component for form rows
function FormRow({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <label className="flex items-center gap-1 pt-2.5 text-base text-gray-700 sm:w-40 sm:justify-end sm:pr-4">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex-1">
        {children}
        {error && <p className="mt-1.5 text-base text-red-500">{error}</p>}
      </div>
    </div>
  )
}
