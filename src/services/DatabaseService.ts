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
}
