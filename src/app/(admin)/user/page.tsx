'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { RotateCcw, Search, Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import { fetchUsers, deleteUser as apiDeleteUser, User } from '@/lib/api/endpoints'
import { formatNumber, getUserPermissionTypeName, UserPermissionType } from '@/types/enums'

const PER_PAGE = 20

export default function UserListPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  const columns: Column<User>[] = [
    { key: 'employeeId', label: '社員番号', sortable: true },
    {
      key: 'name',
      label: '氏名',
      sortable: true,
      render: (val: string) => <span className="font-medium text-gray-900">{val}</span>,
    },
    {
      key: 'permission',
      label: '権限',
      render: (val: number) => (
        <span className="">
          {getUserPermissionTypeName(val as UserPermissionType)}
        </span>
      ),
    },
    {
      key: 'stores',
      label: '所属店舗',
      render: (val: User['stores']) => {
        if (!val || val.length === 0) return <span className="text-gray-400">—</span>
        if (val.length <= 2) return <span className="text-gray-700">{val.map(s => s.storeName).join(' / ')}</span>
        return (
          <span className="text-gray-700" title={val.map(s => s.storeName).join(', ')}>
            {val[0].storeName}，ほか{val.length - 1}件
          </span>
        )
      },
    },
    {
      key: 'departments',
      label: '所属部門',
      render: (val: User['departments']) => {
        if (!val || val.length === 0) return <span className="text-gray-400">—</span>
        if (val.length <= 2) return <span className="text-gray-700">{val.map(d => d.departmentName).join(' / ')}</span>
        return (
          <span className="text-gray-700" title={val.map(d => d.departmentName).join(', ')}>
            {val[0].departmentName}，ほか{val.length - 1}件
          </span>
        )
      },
    },
    {
      key: 'isActive',
      label: '有効区分',
      render: (val: boolean) => (
        <span className="">
          {val ? '有効' : '無効'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (_val: any, row: User) => (
        <div className="flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/user/${row.id}`) }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Pencil className="h-3.5 w-3.5" />
            編集
          </button>
          <button
            onClick={e => { e.stopPropagation(); setDeleteTarget(row) }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            削除
          </button>
        </div>
      ),
    },
  ]

  const fetchData = useCallback(async (p: number) => {
    setLoading(true)
    const response = await fetchUsers({ page: p, perPage: PER_PAGE, search: searchText || undefined })
    setLoading(false)
    if (response) {
      setUsers(response.data)
      setTotal(response.total)
    }
  }, [searchText])

  useEffect(() => {
    fetchData(1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch() {
    setPage(1)
    fetchData(1)
  }

  function handleReset() {
    setSearchText('')
    setPage(1)
    fetchData(1)
  }

  function handlePageChange(p: number) {
    setPage(p)
    fetchData(p)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    await apiDeleteUser(deleteTarget.id)
    setDeleteTarget(null)
    await fetchData(page)
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <PageHeader title="ユーザー管理" subtitle="システムのユーザーアカウントを管理します" />

      {/* Search Bar */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-4">
            <label className="whitespace-nowrap text-gray-700 sm:w-32 sm:text-right">
              あいまい検索
            </label>
            <div className="max-w-lg flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="社員番号・氏名"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-base text-gray-700 shadow-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:border-l sm:border-gray-100 sm:pl-8 shrink-0">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-base text-gray-600 transition-colors hover:bg-gray-100 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              リセット
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-base text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60 whitespace-nowrap"
            >
              検索
            </button>
            <button
              onClick={() => router.push('/user/create')}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-300 bg-white px-4 py-2.5 text-base text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              新規追加
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <DataTable
          columns={columns}
          data={users}
          emptyMessage="該当するユーザーは見つかりませんでした。"
        />
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <span className="text-base text-gray-500">全 {formatNumber(total)} 件のご確認</span>
            <Pagination currentPage={page} totalItems={total} perPage={PER_PAGE} onPageChange={handlePageChange} />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="ユーザー削除"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2 text-base text-gray-700 shadow-sm hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-5 py-2 text-base text-white shadow-sm hover:bg-red-700"
            >
              削除する
            </button>
          </>
        }
      >
        <p className="text-gray-700">
          <span className="">{deleteTarget?.name}</span> を削除します。
          <br />本当によろしいですか？
        </p>
      </Modal>
    </div>
  )
}
