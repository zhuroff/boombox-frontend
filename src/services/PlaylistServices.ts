import api from '~/api'
import { PlayListItem, PlaylistPage } from '~/types/Playlist'
import { Track } from '~/types/Track'

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
}