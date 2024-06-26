import api from '~/api'
import commonServices from './common.services'
import { CloudEntity, CloudEntityReq, CloudEntityReqExt, CloudEntityReqFile, CloudEntityReqRandom, CloudEntityRes } from '~/types/ReqRes'

export default {
  async getImages<T>({ path, limit, offset, cloudURL, root }: CloudEntityReqExt): Promise<void | T> {
    const response = await api.post('/api/cloud/images', { path, limit, offset, cloudURL, root, type: 'image' })
    commonServices.errorChecker(response.status)
    return response.data
  },

  async getFile<File>({ entityType, path, cloudURL, type, root }: CloudEntityReqFile) {
    const response = await api.post<File>(`/api/${entityType}`, { path, cloudURL, type, root })
    commonServices.errorChecker(response.status)
    return response.data
  },

  async getTrackDuration({ path, cloudURL }: CloudEntityReq) {
    const response = await api.post('/api/cloud/track/duration', { path, cloudURL })
    commonServices.errorChecker(response.status)
    return response.data
  },
  
  async getFolderContent({ path, cloudURL, root, limit, offset }: CloudEntityReqExt): Promise<CloudEntityRes> {
    const response = await api.post('/api/cloud/content', { path, limit, root, offset, cloudURL })
    commonServices.errorChecker(response.status)
    return response.data
  },

  async getRandomTracks({ path, years, cloudURL, root, limit }: CloudEntityReqExt & { years: string[] }): Promise<CloudEntityRes['items']> {
    const response = await api.post('/api/cloud/tracks/random', { path, years, cloudURL, root, limit })
    commonServices.errorChecker(response.status)
    return response.data
  },

  async getRamdomAlbums<T>({ path, criteria, exclude, value, cloudURL, root, limit }: CloudEntityReqRandom): Promise<Array<CloudEntity & T>> {
    const response = await api.post('/api/cloud/albums/random', { path, criteria, exclude, value, cloudURL, root, limit })
    commonServices.errorChecker(response.status)
    return response.data
  }
}
