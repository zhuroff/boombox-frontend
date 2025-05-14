import api from '~/api'
// import type { SearchPayload, SearchResultState } from '~/types/Search'
// import commonServices from './common.services'

export default {
  // async createEntity<T, U>(entityKey: string, payload?: U): Promise<T> {
  //   const response = await api.post<T>(`/api/${entityKey}/create`, payload)
  //   commonServices.errorChecker(response.status)
  //   return response.data
  // },

  // async getEntity<T>(entityKey: string, path: string) {
  //   const response = await api.get<T>(`/api/${entityKey}/${path}`)
  //   commonServices.errorChecker(response.status)
  //   return response.data
  // },

  // async updateEntity<T, U>(entityKey: string, payload?: U): Promise<T> {
  //   const response = await api.patch<T>(`/api/${entityKey}/update`, payload)
  //   commonServices.errorChecker(response.status)
  //   return response.data
  // },

  async reorderEntities<T, U>(entityKey: string, id: string, payload: U): Promise<T> {
    const response = await api.patch<T>(`/api/${entityKey}/${id}/reorder`, payload)
    // commonServices.errorChecker(response.status)
    return response.data
  },

  // async deleteEntity<T>(entityKey: string, id: string): Promise<T> {
  //   const response = await api.delete<T>(`/api/${entityKey}/${id}`)
  //   // commonServices.errorChecker(response.status)
  //   return response.data
  // },

  // async getEntityList<T>(entityKey: string, config: RequestConfig) {
  //   const response = await api.post<T>(`/api/${entityKey}`, config)
  //   commonServices.errorChecker(response.status)
  //   return response.data
  // },
  
  // async search(payload: SearchPayload) {
  //   const response = await api.post<SearchResultState[]>(`/api/search`, payload)
  //   commonServices.errorChecker(response.status)
  //   return response.data
  // }
}