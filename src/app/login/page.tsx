'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('system-admin')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.includes('@') ? email : `${email}@md.sensy.ai`,
        password,
      })

      if (authError) {
        setError('ログインに失敗しました。IDまたはパスワードをご確認ください。')
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('ログインに失敗しました。')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0B1727] font-sans">
      {/* Left Panel (Brand) */}
      <div className="relative flex w-1/2 flex-col items-center justify-center">
        <div className="flex items-center justify-center p-8">
          <img src="/img/logo.png" alt="SENSY logo" className="w-[30rem] max-w-[70%] object-contain" />
        </div>
        {/* Center Divider Line */}
        <div className="absolute right-0 top-1/2 h-[60%] w-[1px] -translate-y-1/2 bg-slate-700"></div>
      </div>

      {/* Right Panel (Login Form) */}
      <div className="relative flex w-1/2 flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-12">
          <div className="text-center">
            <h2 className="text-5xl font-light tracking-wide text-white">Login</h2>
            <p className="mt-6 text-[15px] uppercase tracking-[0.2em] text-slate-400">
              Please login to Admin Dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-12 space-y-8">
            {error && (
              <div className="rounded-md bg-red-500/10 p-5 text-center text-lg text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <input
                id="email-address"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="sensy-md-email"
                required
                placeholder="Username"
                className="w-full rounded bg-white px-6 py-5 text-xl text-gray-900 placeholder-gray-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="sensy-md-password"
                  required
                  placeholder="Password"
                  className="w-full rounded bg-white px-6 py-5 pr-14 text-xl text-gray-900 placeholder-gray-400 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 scale-125 origin-right"
                >
                  {showPassword ? <Eye className="h-6 w-6" /> : <EyeOff className="h-6 w-6" />}
                </button>
              </div>

              <div className="text-left pt-1">
                <a
                  href="https://sensy.ai/contact_service/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-blue-500 transition-colors hover:text-blue-400"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded bg-gradient-to-r from-pink-500 to-indigo-600 px-6 py-5 text-lg tracking-widest text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Right Links */}
        <div className="absolute bottom-12 right-12 flex items-center gap-8 text-[14px] uppercase tracking-wider text-slate-500">
          <a
            href="https://sensy.ai/term_policies/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Term-policies
          </a>
          <a
            href="https://sensy.ai/report/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            Report
          </a>
        </div>
      </div>
    </div>
  )
}
