import { api } from '~shared/api'
import type { RequestConfig } from '~shared/lib'

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

  getEntityList = async <T>(entityKey: string, config: RequestConfig) => {
    const queryString = this.#configToQueryString(config)
    const response = await api.get<T>(`/api/${entityKey}?${queryString}`)
    return response.data
  }

  getEntityPage = async <T>(entityKey: string, path: string) => {
    const response = await api.get<T>(`/api/${entityKey}/${path}`)
    return response.data
  }

  createEntity = async <T, U>(entityKey: string, payload: U | null) => {
    if (!payload) {
      throw new Error('Query payload is not defined')
    }

    const response = await api.post<T>(`/api/${entityKey}/create`, payload)
    return response.data
  }

  updateEntity = async <T, U>(entityKey: string, payload: U) => {
    if (!payload) {
      throw new Error('Query payload is not defined')
    }
    
    const response = await api.patch<T>(`/api/${entityKey}/update`, payload)
    return response.data
  }

  deleteEntity = async <T>(entityKey: string, id: string | null) => {
    if (!id) {
      throw new Error('Entity id is not defined')
    }

    const response = await api.delete<T>(`/api/${entityKey}/${id}`)
    return response.data
  }

  reorderEntities = async <T, U>(entityKey: string, id: string, payload: U) => {
    const response = await api.patch<T>(`/api/${entityKey}/${id}/reorder`, payload)
    return response.data
  }

  getCloudFiles = async <T>(entityKey: string, path: string, query = '') => {
    const response = await api.get<T>(`/api/${entityKey}/${path}?${query}`)
    return response.data
  }

  sync = async () => {  
    const response = await api.post('/api/sync')
    return response.data
  }
}