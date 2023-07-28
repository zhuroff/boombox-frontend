import api from '~/api'
import { RequestConfig } from "~/types/Global";

export default class DBApiService {
  static async getEntityList<T>(config: RequestConfig, entityType: string) {
    const response = await api.post<T>(`/api/${entityType}`, config)
    if (response.status !== 200) {
      throw new Error()
    }
    return response.data
  }
}