import api from '~/api'
import commonServices from './common.services'
import { CloudEntityRes } from '~/types/ReqRes'

export default {
  async getImages<T>(path: string, limit: number, offset: number, cloudURL: string, root?: string): Promise<void | T> {
    const response = await api.post('/api/cloud/images', { path, limit, offset, cloudURL, root, type: 'image' })
    commonServices.errorChecker(response.status)
    return response.data
  },
  async getFile<File>(entityType: string, path: string, cloudURL: string, type: string, root?: string) {
    const response = await api.post<File>(`/api/${entityType}`, { path, cloudURL, type, root })
    commonServices.errorChecker(response.status)
    return response.data
  },
  async getTrackDuration(path: string, cloudURL: string) {
    const response = await api.post('/api/cloud/track/duration', { path, cloudURL })
    commonServices.errorChecker(response.status)
    return response.data
  },
  async getFolderContent(path: string, cloudURL: string, root?: string, limit?: number, offset?: number): Promise<CloudEntityRes> {
    const response = await api.post('/api/cloud/content', { path, limit, root, offset, cloudURL })
    commonServices.errorChecker(response.status)
    return response.data
  }
}
