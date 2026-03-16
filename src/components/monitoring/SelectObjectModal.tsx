'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
import Modal from '@/components/Modal'
import DataTable, { Column } from '@/components/DataTable'
import Pagination from '@/components/Pagination'

interface FetchItemsResult {
  data: any[]
  total: number
}

interface SelectObjectModalProps<T = any> {
  isOpen: boolean
  onClose: () => void
  onSave: (selected: T[]) => void
  title: string
  columns: Column<T>[]
  idKey: string
  initialSelected: T[]
  fetchItems: (params: { text: string; page: number; perPage: number }) => Promise<FetchItemsResult | null>
  initialStateIsEmpty?: boolean
}

export default function SelectObjectModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSave,
  title,
  columns,
  idKey,
  initialSelected,
  fetchItems,
  initialStateIsEmpty = false,
}: SelectObjectModalProps<T>) {
  const [searchText, setSearchText] = useState('')
  const [items, setItems] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<T[]>([])
  const [errorVisible, setErrorVisible] = useState(false)

  const perPage = 10

  const handleSearch = useCallback(async (p: number, text: string) => {
    setLoading(true)
    const result = await fetchItems({ text, page: p, perPage })
    setLoading(false)
    if (result) {
      setItems(result.data)
      setTotal(result.total)
      setErrorVisible(result.data.length === 0)
    } else {
      setItems([])
      setTotal(0)
      setErrorVisible(true)
    }
  }, [fetchItems, perPage])

  // Sync internal selected with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelected([...initialSelected])
      setSearchText('')
      setPage(1)
      setItems([])
      setTotal(0)
      setErrorVisible(false)
      if (!initialStateIsEmpty) {
        handleSearch(1, '')
      }
    }
  }, [isOpen, initialSelected, initialStateIsEmpty, handleSearch]) // eslint-disable-line react-hooks/set-state-in-effect

  function onPageChange(p: number) {
    setPage(p)
    handleSearch(p, searchText)
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    handleSearch(1, searchText)
  }

  const footer = (
    <div className="flex w-full items-center justify-between">
      <div className="flex-1">
        {total > 0 && (
          <Pagination
            currentPage={page}
            totalItems={total}
            perPage={perPage}
            onPageChange={onPageChange}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-base text-gray-600 transition-colors hover:bg-gray-100"
        >
          閉じる
        </button>
        <button
          onClick={() => onSave(selected)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-base text-white shadow-sm transition-all hover:bg-indigo-700"
        >
          保存
        </button>
      </div>
    </div>
  )

  // Determine modal size based on columns
  const modalSize = columns.length <= 2 ? 'md' : columns.length <= 4 ? 'lg' : 'xl'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size={modalSize}>
      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={onSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="検索内容を入力..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-base focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-gray-900 px-4 py-2 text-base text-white transition-all hover:bg-gray-800 disabled:opacity-50"
          >
            検索
          </button>
        </form>

        {/* Content Table */}
        <div className="rounded-xl border border-gray-100 bg-white">
          <DataTable
            columns={columns}
            data={items}
            idKey={idKey}
            selectedRows={selected}
            onSelect={setSelected}
            emptyMessage={errorVisible ? 'データが見つかりませんでした' : '検索してください'}
            className="min-h-[300px]"
          />
        </div>
      </div>
    </Modal>
  )
}
