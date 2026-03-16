'use client'

import { Calendar } from 'lucide-react'

interface DatepickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export default function Datepicker({
  value,
  onChange,
  className = '',
  placeholder = 'YYYY/MM/DD',
}: DatepickerProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Calendar className="h-5 w-5 text-gray-500" />
      </div>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-lg border-gray-200 py-2.5 pl-11 pr-4 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 bg-white"
      />
    </div>
  )
}
