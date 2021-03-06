import { ReorderPayload, ResponseMessage } from '~/types/Global'
import { PlayListItem, PlaylistPage } from '~/types/Playlist'
import api from '~/api'

export default class PlaylistServices {
  static async list() {
    const response = await api.get<PlayListItem[]>('/api/playlists')
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async single(id: string) {
    const response = await api.get<PlaylistPage>(`/api/playlists/${id}`)

    if (response?.status === 200) {
      const result: PlaylistPage = {
        ...response.data,
        tracks: response.data.tracks.map((track) => ({
          ...track,
          title: `${track.artist.title} - ${track.title}`
        }))
      }

      return result
    }

    throw new Error()
  }

  static async reorder(payload: ReorderPayload) {
    const response = await api.patch<ResponseMessage>(`/api/playlists/${payload.entityID}/reorder`, payload)

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error('Request failed')
  }

  static async remove(id: string) {
    const response = await api.delete<ResponseMessage>(`/api/playlists/${id}`)
    
    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error('Request failed')
  }

  static async rename(id: string, title: string) {
    const response = await api.patch<ResponseMessage>(`/api/playlists/${id}/rename`, { title })

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error('Request failed')
  }
}