import { api } from '~/shared/api'
import type { User, AuthRefreshResponse } from '~entities/user'
import type { FormPayload, RequestConfig } from '~shared/lib'
import type { SearchPayload, SearchResultState } from '../lib'

export default class DatabaseService {
  #configToQueryString(config: RequestConfig) {
    const params = new URLSearchParams()

    const appendParams = (
      obj: Record<string, any>,
      prefix = ''
    ) => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key

        if (value === undefined || value === null) continue

        if (typeof value === 'object' && !Array.isArray(value)) {
          appendParams(value, fullKey)
        } else {
          params.set(fullKey, String(value))
        }
      }
    }

    appendParams(config)

    return params.toString()
  }

  refresh = async () => {
    try {
      const response = await api.get<AuthRefreshResponse>('/api/users/refresh')
      return response.data
    } catch (error) {
      throw error
    }
  }

  login = async (payload: FormPayload) => {
    try {
      const response = await api.post<AuthRefreshResponse>('/api/users/login', payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  logout = async () => {
    try {
      await api.post('/api/users/logout')
    } catch (error) {
      throw error
    }
  }

  createUser = async (userData: FormPayload) => {
    try {
      const response = await api.post<User>('/api/users/create', userData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  getUsers = async () => {
    try {
      const response = await api.get<User[]>('/api/users')
      return response.data
    } catch (error) {
      throw error
    }
  }

  getEntityList = async <T>(entityKey: string, config: RequestConfig) => {
    try {
      const queryString = this.#configToQueryString(config)
      const response = await api.get<T>(`/api/${entityKey}?${queryString}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  getEntityPage = async <T>(entityKey: string, path: string) => {
    try {
      const response = await api.get<T>(`/api/${entityKey}/${path}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  createEntity = async <T, U>(entityKey: string, payload: U | null) => {
    if (!payload) {
      throw new Error('Query payload is not defined')
    }

    try {
      const response = await api.post<T>(`/api/${entityKey}/create`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  updateEntity = async <T, U>(entityKey: string, payload?: U | null) => {
    if (!payload) {
      throw new Error('Query payload is not defined')
    }
    
    try {
      const response = await api.patch<T>(`/api/${entityKey}/update`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  deleteEntity = async <T>(entityKey: string, id: string | null) => {
    if (!id) {
      throw new Error('Entity id is not defined')
    }

    try {
      const response = await api.delete<T>(`/api/${entityKey}/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  reorderEntities = async <T, U>(entityKey: string, id: string, payload: U) => {
    try {
      const response = await api.patch<T>(`/api/${entityKey}/${id}/reorder`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  getCloudFiles = async <T>(entityKey: string, path: string, query: string) => {
    try {
      const response = await api.get<T>(`/api/${entityKey}/${path}?${query}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  search = async (payload: SearchPayload) => {
    try {
      const response = await api.post<SearchResultState[]>(`/api/search`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }

  sync = async () => {
    try {
      const response = await api.post('/api/sync')
      return response.data
    } catch (error) {
      throw error
    }
  }
}
