import { AlbumBasicResponse, IAlbumFull } from '~/types/Album'
import { RequestConfig } from '~/types/Global'
import api from '~/api'

export default class AlbumServices {
  static async list(config: RequestConfig): Promise<AlbumBasicResponse> {
    const response = await api.post<AlbumBasicResponse>('/api/albums', config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async album(id: string): Promise<IAlbumFull> {
    const response = await api.get<IAlbumFull>(`/api/albums/${id}`)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }

  static async description(id: string, description: string): Promise<void> {
    await api.patch(`/api/albums/${id}/description`, { description })
  }

  static async booklet(id: string, booklet: number): Promise<string[]> {
    const response = await api.get(`/api/albums/${id}/${booklet}`)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}