import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import clsx from 'clsx'

// Use a modern, highly legible sans-serif font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans', // reuse the var name created by create-next-app for simplicity
})

export const metadata: Metadata = {
  title: 'SENSY MD | SENSY Inc.',
  description: 'AI Demand Forecasting System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" translate="no" suppressHydrationWarning>
      <body className={clsx(inter.variable, 'h-full flex flex-col font-sans text-base')} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
