import api from '~/api'
import { ReorderPayload, ResponseMessage } from '~/types/Global'
import { PlayListItem, PlaylistPage } from '~/types/Playlist'

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
}