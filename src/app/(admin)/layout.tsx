'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { 
  LogOut, 
  Menu, 
  Home, 
  LayoutDashboard, 
  ShieldCheck, 
  BellRing,
  BarChart3,
  TrendingUp,
  PenSquare,
  FileDown,
  SlidersHorizontal,
  Users,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  PlusCircle,
  Clock,
  FileText,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [isDashboardOpen, setIsDashboardOpen] = useState(true)
  const [isOrderConditionsOpen, setIsOrderConditionsOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex h-[100dvh] flex-col bg-[#F5F6FA] text-gray-900">
      {/* Header - exact match of AppHeader.vue */}
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b-2 border-indigo-600/90 bg-white px-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] sm:px-6">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-gray-900 transition-all duration-200 hover:opacity-80"
          >
            <Image
              src="/img/logo.png"
              alt="SENSY logo"
              width={32}
              height={32}
              className="h-8 w-auto brightness-110 drop-shadow-sm grayscale-[30%]"
              priority
            />
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              SENSY MD
            </span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2 flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="hidden sm:inline-block text-base font-medium">メニュー</span>
          </button>
        </div>

        <div className="flex items-center gap-5">
          {/* User role badge */}
          <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 ring-1 ring-slate-200/80 lg:flex">
            <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-700">
            </div>
            <span className="text-base font-semibold tracking-wide text-slate-700">
              システム管理者
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-2 text-base font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span className="hidden sm:inline-block">ログアウト</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isMenuOpen && (
          <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white shadow-[1px_0_2px_0_rgba(0,0,0,0.02)]">
            <div className="flex flex-1 flex-col gap-3 p-5">
              {/* Dashboard Accordion */}
              <div>
                <button
                  onClick={() => setIsDashboardOpen(!isDashboardOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[17px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-400" />
                    <span>ダッシュボード</span>
                  </div>
                  {isDashboardOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isDashboardOpen && (
                  <div className="ml-2 mt-1 border-l border-gray-100 pb-1 pl-2">
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/')
                          ? "text-indigo-600 bg-indigo-50 font-bold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      ダッシュボードトップ
                    </Link>
                    <Link
                      href="/stock-alert"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/stock-alert')
                          ? "text-indigo-600 bg-indigo-50 font-semibold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <ShieldCheck className="h-6 w-6 text-indigo-400" />
                      在庫アラートリスト
                    </Link>
                    <Link
                      href="/threshold-alert"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/threshold-alert')
                          ? "text-indigo-600 bg-indigo-50 font-semibold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <BellRing className="h-6 w-6 text-orange-400" />
                      閾値アラートリスト
                    </Link>
                  </div>
                )}
              </div>

              <div className="my-1 border-t border-gray-100"></div>

              {/* Main Navigation Links */}
              <nav className="space-y-1">
                <Link
                  href="/monitoring"
                  className={cn(
                    "flex items-center gap-4 rounded-lg py-3 px-4 text-[17px] font-bold transition-colors relative",
                    isActive('/monitoring')
                      ? "text-indigo-600 bg-indigo-50 font-bold before:absolute before:inset-y-1/4 before:-left-5 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  モニタリング
                </Link>
                <Link
                  href="/effectiveness"
                  className={cn(
                    "flex items-center gap-4 rounded-lg py-3 px-4 text-[17px] font-bold transition-colors relative whitespace-nowrap",
                    isActive('/effectiveness')
                      ? "text-indigo-600 bg-indigo-50 font-semibold before:absolute before:inset-y-1/4 before:-left-5 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  効果測定
                </Link>
                <Link
                  href="/order"
                  className={cn(
                    "flex items-center gap-4 rounded-lg py-3 px-4 text-[17px] font-bold transition-colors relative whitespace-nowrap",
                    isActive('/order')
                      ? "text-indigo-600 bg-indigo-50 font-semibold before:absolute before:inset-y-1/4 before:-left-5 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <PenSquare className="h-5 w-5 text-gray-400" />
                  発注修正
                </Link>
                <Link
                  href="/evidence-export"
                  className={cn(
                    "flex items-center gap-4 rounded-lg py-3 px-4 text-[17px] font-bold transition-colors relative whitespace-nowrap",
                    isActive('/evidence-export')
                      ? "text-indigo-600 bg-indigo-50 font-semibold before:absolute before:inset-y-1/4 before:-left-5 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <FileDown className="h-5 w-5 text-gray-400" />
                  エビデンス出力
                </Link>
                <Link
                  href="/config"
                  className={cn(
                    "flex items-center gap-4 rounded-lg py-3 px-4 text-[17px] font-bold transition-colors relative whitespace-nowrap",
                    isActive('/config')
                      ? "text-indigo-600 bg-indigo-50 font-semibold before:absolute before:inset-y-1/4 before:-left-5 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <SlidersHorizontal className="h-5 w-5 text-gray-400" />
                  アラート閾値設定
                </Link>
                <Link
                  href="/user"
                  className={cn(
                    "flex items-center gap-4 rounded-lg py-3 px-4 text-[17px] font-bold transition-colors relative whitespace-nowrap",
                    isActive('/user')
                      ? "text-indigo-600 bg-indigo-50 font-semibold before:absolute before:inset-y-1/4 before:-left-5 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Users className="h-5 w-5 text-gray-400" />
                  ユーザー管理
                </Link>
              </nav>

              <div className="my-1 border-t border-gray-100"></div>

              {/* Order Conditions Accordion */}
              <div>
                <button
                  onClick={() => setIsOrderConditionsOpen(!isOrderConditionsOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[17px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="h-5 w-5 text-gray-400" />
                    <span>発注条件マスタ</span>
                  </div>
                  {isOrderConditionsOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isOrderConditionsOpen && (
                  <div className="ml-2 mt-1 border-l border-gray-100 pb-1 pl-2">
                    <Link
                      href="/order-conditions"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/order-conditions')
                          ? "text-indigo-600 bg-indigo-50 font-semibold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <ListOrdered className="h-4 w-4" />
                      商品別発注条件
                    </Link>
                    <Link
                      href="/order-conditions/upsert"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/order-conditions/upsert')
                          ? "text-indigo-600 bg-indigo-50 font-semibold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <PlusCircle className="h-4 w-4" />
                      発注条件一括更新
                    </Link>
                    <Link
                      href="/order-conditions/history"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/order-conditions/history')
                          ? "text-indigo-600 bg-indigo-50 font-semibold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <Clock className="h-4 w-4" />
                      一括更新履歴
                    </Link>
                    <Link
                      href="/order-conditions/import"
                      className={cn(
                        "flex items-center gap-3 rounded-md py-3 px-3 text-[17px] font-bold transition-colors whitespace-nowrap",
                        isActive('/order-conditions/import')
                          ? "text-indigo-600 bg-indigo-50 font-semibold relative before:absolute before:inset-y-0 before:-left-3 before:w-[3px] before:bg-indigo-600 before:rounded-r-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      一括CSV更新
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Main content area */}
        <main className="w-full flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] p-6 sm:p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
