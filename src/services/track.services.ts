import api from '~/api'
import { ResponseMessage } from '~/types/Common'
import { TrackLyricsData, TrackLyricsResponse } from '~/types/Track'

export default {
  async fetchLyrics(id: string) {
    const response = await api.get<TrackLyricsData>(`/api/tracks/${id}/lyrics`)

    if (response?.status === 200) {
      return response.data.lyrics
    }

    throw new Error()
  },
  async searchLyrics(query: string) {
    const response = await api.post<TrackLyricsResponse[]>('/api/tracks/lyrics', { query })

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  },
  async saveLyrics(id: string, lyrics: string) {
    const response = await api.patch<ResponseMessage>(`/api/tracks/${id}/lyrics`, { lyrics })

    if (response?.status === 200) {
      return response.data.message
    }

    throw new Error()
  }
}
