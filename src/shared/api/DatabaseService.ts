import api from '~/api'

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

  search = async (payload: SearchPayload) => {
    try {
      const response = await api.post<SearchResultState[]>(`/api/search`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
