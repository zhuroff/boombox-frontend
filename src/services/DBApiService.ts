import api from '~/api'
import { RequestConfig } from '~/types/Common'
import { SearchPayload, SearchResultState } from '~/types/Search'
import CommonService from './CommonService'

export default class DBApiService {
  static async getEntity<T>(entityType: string, path: string) {
    const response = await api.get<T>(`/api/${entityType}/${path}`)
    CommonService.errorChecker(response.status)
    return response.data
  }

  static async getEntityList<T>(config: RequestConfig, entityType: string) {
    const response = await api.post<T>(`/api/${entityType}`, config)
    CommonService.errorChecker(response.status)
    return response.data
  }

  static async getFile<File>(entityType: string, path: string) {
    const response = await api.post<File>(`/api/${entityType}`, { path })
    CommonService.errorChecker(response.status)
    return response.data
  }

  static async search(payload: SearchPayload) {
    const response = await api.post<SearchResultState[]>(`/api/search`, payload)
    CommonService.errorChecker(response.status)
    return response.data
  }
}