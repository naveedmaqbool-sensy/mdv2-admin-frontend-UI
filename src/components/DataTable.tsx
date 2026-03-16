'use client'

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { useState, useMemo } from 'react'

export interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

interface DataTableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
  onRowClick?: (row: T) => void
  selectedRows?: T[]
  onSelect?: (rows: T[]) => void
  idKey?: string
  className?: string
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = 'データがありません',
  onRowClick,
  selectedRows,
  onSelect,
  idKey = 'id',
  className = '',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal), 'ja')
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function isSelected(row: T) {
    return selectedRows?.some(r => r[idKey] === row[idKey]) ?? false
  }

  function toggleRow(row: T) {
    if (!onSelect || !selectedRows) return
    if (isSelected(row)) {
      onSelect(selectedRows.filter(r => r[idKey] !== row[idKey]))
    } else {
      onSelect([...selectedRows, row])
    }
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            {onSelect && (
              <th className="w-12 px-4 py-3.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedRows?.length === data.length && data.length > 0}
                  onChange={() => {
                    if (selectedRows?.length === data.length) {
                      onSelect([])
                    } else {
                      onSelect([...data])
                    }
                  }}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-5 py-4 text-[17px] font-bold tracking-wide text-gray-700 ${col.sortable ? 'cursor-pointer select-none hover:text-gray-900' : ''} ${col.headerClassName || ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && (
                    <span className="text-gray-400">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onSelect ? 1 : 0)}
                className="px-5 py-12 text-center text-base text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={row[idKey] ?? i}
                className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${isSelected(row) ? 'bg-indigo-50/60' : 'hover:bg-gray-50/80'}`}
                onClick={() => onRowClick?.(row)}
              >
                {onSelect && (
                  <td className="w-12 px-4 py-3" onClick={e => { e.stopPropagation(); toggleRow(row) }}>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={isSelected(row)}
                      readOnly
                    />
                  </td>
                )}
                {columns.map(col => (
                  <td key={col.key} className={`whitespace-nowrap px-5 py-3.5 text-base text-gray-700 ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
