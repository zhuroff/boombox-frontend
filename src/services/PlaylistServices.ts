import api from '~/api'
import { PlayListItem } from '~/types/Playlist'

export default class PlaylistServices {
  static async list() {
    const response = await api.get<PlayListItem[]>('/api/playlists')
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}