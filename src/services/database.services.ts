import api from '~/api'
import { RequestConfig } from '~/types/Common'
import { SearchPayload, SearchResultState } from '~/types/Search'
import commonServices from './common.services'

export default {
  async createEntity<T, U>(entityType: string, payload?: U): Promise<T> {
    const response = await api.post<T>(`/api/${entityType}/create`, payload)
    commonServices.errorChecker(response.status)
    return response.data
  },
  async getEntity<T>(entityType: string, path: string) {
    const response = await api.get<T>(`/api/${entityType}/${path}`)
    commonServices.errorChecker(response.status)
    return response.data
  },
  async updateEntity<T, U>(entityType: string, payload?: U): Promise<T> {
    const response = await api.patch<T>(`/api/${entityType}/update`, payload)
    commonServices.errorChecker(response.status)
    return response.data
  },
  async reorderEntities<T, U>(entityType: string, id: string, payload: U): Promise<T> {
    const response = await api.patch<T>(`/api/${entityType}/${id}/reorder`, payload)
    commonServices.errorChecker(response.status)
    return response.data
  },
  async deleteEntity<T>(entityType: string, id: string): Promise<T> {
    const response = await api.delete<T>(`/api/${entityType}/${id}`)
    commonServices.errorChecker(response.status)
    return response.data
  },
  async getEntityList<T>(config: RequestConfig, entityType: string) {
    const response = await api.post<T>(`/api/${entityType}`, config)
    commonServices.errorChecker(response.status)
    return response.data
  },
  async search(payload: SearchPayload) {
    const response = await api.post<SearchResultState[]>(`/api/search`, payload)
    commonServices.errorChecker(response.status)
    return response.data
  }
}