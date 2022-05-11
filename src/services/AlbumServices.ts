import { AlbumPageResponse, AlbumPage, DiscogsResponse } from '~/types/Album'
import { RequestConfig } from '~/types/Global'
import api from '~/api'

export default class AlbumServices {
  static async list(config: RequestConfig) {
    const response = await api.post<AlbumPageResponse>('/api/albums', config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async album(id: string) {
    const response = await api.get<AlbumPage>(`/api/albums/${id}`)

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

  static async discogs(album: AlbumPage, page: number) {
    const payload = {
      artist: album.artist.title,
      album: album.title,
      page
    }

    const response = await api.post<DiscogsResponse>(`/api/albums/${album._id}/discogs`, payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}