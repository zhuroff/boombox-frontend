import { hostString } from '~shared/utils'
import { cleanUser } from '~shared/model'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type RequestParams = Record<string, string | number | boolean | null | undefined>

export type ApiRequestConfig = {
  params?: RequestParams
  headers?: Record<string, string>
}

export type ApiResponse<T> = {
  data: T
  status: number
}

export class ApiError<T = unknown> extends Error {
  response: {
    status: number
    data: T
  }

  constructor(status: number, data: T) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.response = { status, data }
  }
}

const baseURL = hostString('')

const defaultHeaders: Record<string, string> = {
  accept: 'application/json',
  'content-type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
}

const buildUrl = (path: string, params?: RequestParams) => {
  const url = new URL(path, baseURL)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

const parseResponseBody = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()

  if (!text) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return JSON.parse(text) as T
  }

  return text as unknown as T
}

const request = async <T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  config?: ApiRequestConfig
): Promise<ApiResponse<T>> => {
  const isFormData = body instanceof FormData
  const headers = {
    ...defaultHeaders,
    ...config?.headers
  }

  if (isFormData) {
    delete headers['content-type']
  }

  const response = await fetch(buildUrl(path, config?.params), {
    method,
    credentials: 'include',
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body)
  })

  if (response.status === 403) {
    cleanUser()
    updateAuthHeaders()
  }

  if (!response.ok) {
    const data = await parseResponseBody(response)
    throw new ApiError(response.status, data)
  }

  const data = await parseResponseBody<T>(response)

  return {
    data,
    status: response.status
  }
}

export const api = {
  get: <T>(path: string, config?: ApiRequestConfig) => request<T>('GET', path, undefined, config),

  post: <T>(path: string, body?: unknown, config?: ApiRequestConfig) => request<T>('POST', path, body, config),

  patch: <T>(path: string, body?: unknown, config?: ApiRequestConfig) => request<T>('PATCH', path, body, config),

  put: <T>(path: string, body?: unknown, config?: ApiRequestConfig) => request<T>('PUT', path, body, config),

  delete: <T>(path: string, config?: ApiRequestConfig) => request<T>('DELETE', path, undefined, config)
}

export const updateAuthHeaders = () => {
  delete defaultHeaders.Authorization
}
