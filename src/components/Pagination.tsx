'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalItems: number
  perPage: number
  onPageChange: (page: number) => void
  maxVisible?: number
  className?: string
}

export default function Pagination({
  currentPage,
  totalItems,
  perPage,
  onPageChange,
  maxVisible = 5,
  className = '',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / perPage)
  if (totalPages <= 1) return null

  function getVisiblePages(): number[] {
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + maxVisible - 1)
    start = Math.max(1, end - maxVisible + 1)
    const pages: number[] = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex h-10 min-w-9 items-center justify-center rounded-lg px-2 text-base font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="flex h-9 items-center px-1 text-gray-400">…</span>
          )}
        </>
      )}

      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? "flex h-10 min-w-9 items-center justify-center rounded-lg bg-indigo-50 px-2 text-base font-semibold text-indigo-600"
              : "flex h-10 min-w-9 items-center justify-center rounded-lg px-2 text-base text-gray-600 transition-colors hover:bg-gray-100"
          }
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="flex h-9 items-center px-1 text-gray-400">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex h-10 min-w-9 items-center justify-center rounded-lg px-2 text-base font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
