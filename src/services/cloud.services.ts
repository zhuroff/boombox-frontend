import api from '~/api'
import commonServices from './common.services'

export default {
  async getImages<T>(path: string, limit: number, offset: number, cloudURL: string): Promise<void | T> {
    const response = await api.post('/api/cloud/images', { path, limit, offset, cloudURL })
    commonServices.errorChecker(response.status)
    return response.data
  },

  async getTrackDuration(path: string, cloudURL: string) {
    const response = await api.post('/api/cloud/track/duration', { path, cloudURL })
    commonServices.errorChecker(response.status)
    return response.data
  }
}
