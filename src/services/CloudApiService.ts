import api from '~/api'
import CommonService from './CommonService'

export default class CloudApiService {
  static async getImages(path: string) {
    const response = await api.post(`/api/cloud/images`, { path })
    CommonService.errorChecker(response.status)
    return response.data
  }
}
