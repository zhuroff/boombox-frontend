import api from '~/api'
import { RequestConfig } from "~/types/Global";

export default class DBApiService {
  static errorChecker(status: number) {
    if (status !== 200) {
      throw new Error('Failed request')
    }
  }

  static async getEntity<T>(entityType: string, path: string) {
    const response = await api.get<T>(`/api/${entityType}/${path}`)
    DBApiService.errorChecker(response.status)
    return response.data
  }

  static async getEntityList<T>(config: RequestConfig, entityType: string) {
    const response = await api.post<T>(`/api/${entityType}`, config)
    DBApiService.errorChecker(response.status)
    return response.data
  }

  static async getFile<File>(entityType: string, path: string) {
    const response = await api.post<File>(`/api/${entityType}`, { path })
    DBApiService.errorChecker(response.status)
    return response.data
  }
}