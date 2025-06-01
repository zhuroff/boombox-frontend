import api from '~/app/api'
// import commonServices from './common.services'
import type { CloudEntity, CloudEntityReq, CloudEntityReqExt, CloudEntityReqFile, CloudEntityReqRandom, CloudEntityRes } from '~/types/ReqRes'

export default {
  async getImages<T>({ path, limit, offset, cloudURL, root }: CloudEntityReqExt): Promise<void | T> {
    const response = await api.post('/api/toy/images', { path, limit, offset, cloudURL, root, type: 'image' })
    // commonServices.errorChecker(response.status)
    return response.data
  },
  // @ts-expect-error: temp
  async getFile<File>({ entityType, path, cloudURL, cloudId, type, root }: CloudEntityReqFile) {
    const response = await api.post<File>(`/api/${entityType}`, { path, cloudURL, type, root, cloudId })
    // commonServices.errorChecker(response.status)
    return response.data
  },

  async getTrackDuration({ path, cloudURL }: CloudEntityReq) {
    const response = await api.post('/api/toy/track/duration', { path, cloudURL })
    // commonServices.errorChecker(response.status)
    return response.data
  },
  
  async getFolderContent({ path, cloudURL, root, limit, offset }: CloudEntityReqExt): Promise<CloudEntityRes> {
    const response = await api.post('/api/toy/content', { path, limit, root, offset, cloudURL })
    // commonServices.errorChecker(response.status)
    return response.data
  },

  async getRandomTracks({ path, years, cloudURL, root, limit }: CloudEntityReqExt & { years: string[] }): Promise<CloudEntityRes['items']> {
    const response = await api.post('/api/toy/tracks/random', { path, years, cloudURL, root, limit })
    // commonServices.errorChecker(response.status)
    return response.data
  },

  async getRamdomAlbums<T>({ path, criteria, exclude, value, cloudURL, root, limit }: CloudEntityReqRandom): Promise<Array<CloudEntity & T>> {
    const response = await api.post('/api/toy/albums/random', { path, criteria, exclude, value, cloudURL, root, limit })
    // commonServices.errorChecker(response.status)
    return response.data
  }
}
