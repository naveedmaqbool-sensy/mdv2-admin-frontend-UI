'use client'

import { createClient } from '@/lib/supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiResponse<T> {
  data: T
  total?: number
}

export interface PaginatedRequest {
  page: number
  perPage: number
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  return headers
}

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (value instanceof Date) {
        searchParams.set(key, value.toISOString())
      } else {
        searchParams.set(key, String(value))
      }
    }
  })
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export async function apiGet<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const headers = await getAuthHeaders()
    const qs = params ? buildQueryString(params) : ''
    const response = await fetch(`${API_BASE_URL}${endpoint}${qs}`, {
      method: 'GET',
      headers,
    })

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login'
      return null
    }

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    console.error('API GET error:', error)
    return null
  }
}

export async function apiPost<T>(endpoint: string, body?: any): Promise<T | null> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login'
      return null
    }

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    console.error('API POST error:', error)
    return null
  }
}

export async function apiPut<T>(endpoint: string, body?: any): Promise<T | null> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login'
      return null
    }

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    console.error('API PUT error:', error)
    return null
  }
}

export async function apiDelete<T>(endpoint: string, params?: Record<string, any>): Promise<T | null> {
  try {
    const headers = await getAuthHeaders()
    const qs = params ? buildQueryString(params) : ''
    const response = await fetch(`${API_BASE_URL}${endpoint}${qs}`, {
      method: 'DELETE',
      headers,
    })

    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login'
      return null
    }

    if (!response.ok) {
      throw new ApiError(`API Error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    console.error('API DELETE error:', error)
    return null
  }
}

export async function apiDownload(endpoint: string, params?: Record<string, any>): Promise<Blob | null> {
  try {
    const headers = await getAuthHeaders()
    delete headers['Content-Type']
    const qs = params ? buildQueryString(params) : ''
    const response = await fetch(`${API_BASE_URL}${endpoint}${qs}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new ApiError(`Download Error: ${response.statusText}`, response.status)
    }

    return await response.blob()
  } catch (error) {
    console.error('API download error:', error)
    return null
  }
}

export async function apiUpload<T>(endpoint: string, file: File, fieldName: string = 'file'): Promise<T | null> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = { 'Accept': 'application/json' }
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const formData = new FormData()
    formData.append(fieldName, file)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new ApiError(`Upload Error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    console.error('API upload error:', error)
    return null
  }
}
