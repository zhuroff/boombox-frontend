import api from '~/api'
import CommonService from './CommonService'

export default class CloudApiService {
  static async getImages<T>(path: string, limit: number, offset: number): Promise<void | T> {
    const response = await api.post(`/api/cloud/images`, { path, limit, offset })
    CommonService.errorChecker(response.status)
    return response.data
  }
}
