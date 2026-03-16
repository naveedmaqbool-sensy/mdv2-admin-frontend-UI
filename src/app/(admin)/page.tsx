'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar,
  ArrowRight,
  Search,
  BellRing,
  RotateCcw
} from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Datepicker from '@/components/Datepicker'

export default function DashboardPage() {
  const router = useRouter()
  
  const [dateFrom, setDateFrom] = useState('2026/03/09')
  const [dateTo, setDateTo] = useState('2026/03/15')
  
  const [skuAlertCount] = useState<number | null>(null)
  const [adminAlertCount] = useState<number | null>(null)

  function formatNumber(n: number | null) {
    if (n === null) return ''
    return n.toLocaleString()
  }

  const navigateWithParams = (path: string) => {
    const params = new URLSearchParams()
    if (dateFrom) params.append('from', dateFrom)
    if (dateTo) params.append('to', dateTo)
    // Avoid double ? if params are empty
    const qs = params.toString()
    router.push(qs ? `${path}?${qs}` : path)
  }

  function handleReset() {
    setDateFrom('')
    setDateTo('')
  }

  function handleSearch() {
    // In a real app, this would refresh the alert counts according to the date range.
    // For now, it just triggers a re-render or future API call.
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader 
        title="ダッシュボード" 
        subtitle="システムのアラート状況をリアルタイムで監視しています" 
      />

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 flex flex-col sm:flex-row items-start sm:items-center p-3 gap-4">
        
        {/* Left Side: Icon & Label */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
            <Calendar className="h-5 w-5" />
          </div>
          <span className="text-[15px] font-bold text-gray-700 whitespace-nowrap hidden sm:inline-block">対象期間</span>
        </div>

        {/* Date Inputs */}
        <div className="flex items-center gap-2">
          <Datepicker 
            value={dateFrom} 
            onChange={setDateFrom} 
            className="w-48 sm:w-56" 
          />
          <span className="text-gray-300">〜</span>
          <Datepicker 
            value={dateTo} 
            onChange={setDateTo} 
            className="w-48 sm:w-56" 
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex w-full sm:w-auto items-center gap-3">
          <button
            onClick={handleReset}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-[15px] font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
          
          <button
            onClick={handleSearch}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 px-5 py-2 text-[15px] font-bold text-white shadow-sm transition-all"
          >
            <Search className="h-4 w-4" />
            確認
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Stock Alert Card */}
        <div className="rounded-2xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 flex flex-col items-center justify-center p-12 text-center transition-all hover:shadow-md">
          <div className="bg-slate-50 p-4 rounded-3xl mb-4">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#1e293b"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="17" r="1" fill="white"/>
            </svg>
          </div>
          <h2 className="text-[17px] font-bold text-gray-500 mb-4">在庫アラート</h2>
          <div className="text-gray-400 text-base mb-6 flex items-baseline gap-1 min-h-[40px]">
             {skuAlertCount !== null ? (
               <>
                 <span className="text-4xl font-extrabold text-slate-700">{formatNumber(skuAlertCount)}</span> 件
               </>
             ) : (
               <span>件</span>
             )}
          </div>
          <button 
            onClick={() => navigateWithParams('/stock-alert')}
            className="text-indigo-600 font-bold text-sm hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
          >
            詳細を確認する <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Threshold Alert Card */}
        <div className="rounded-2xl bg-white shadow-[0_2px_8px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 flex flex-col items-center justify-center p-12 text-center transition-all hover:shadow-md">
          <div className="bg-slate-50 text-slate-800 p-4 rounded-3xl mb-4">
            <BellRing className="w-8 h-8" fill="currentColor" />
          </div>
          <h2 className="text-[17px] font-bold text-gray-500 mb-4">閾値アラート</h2>
          <div className="text-gray-400 text-base mb-6 flex items-baseline gap-1 min-h-[40px]">
             {adminAlertCount !== null ? (
               <>
                 <span className="text-4xl font-extrabold text-slate-700">{formatNumber(adminAlertCount)}</span> 件
               </>
             ) : (
               <span>件</span>
             )}
          </div>
          <button 
            onClick={() => navigateWithParams('/threshold-alert')}
            className="text-indigo-600 font-bold text-sm hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
          >
            詳細を確認する <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
