import api from '~/api'
import { RequestConfig } from '~/types/Global'
import { NewsPageResponse } from '~/types/News'

export default class NewsServices {
  static async list(config: RequestConfig): Promise<NewsPageResponse> {
    const { page, limit } = config
    const response = await api.post('/api/news', { page, limit })

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
