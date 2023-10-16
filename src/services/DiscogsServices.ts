import api from "~/api"
import { AlbumPage } from "~/types/Album"
import { DiscogsDetails, DiscogsResponse } from "~/types/Discogs"

export default class DiscogsServices {
  static async discogs(album: AlbumPage, page: number) {
    const payload = {
      artist: album.artist.title,
      album: album.title,
      page
    }

    const response = await api.post<DiscogsResponse>(`/api/discogs`, payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }

  static async discogsDetails(id: number) {
    const response = await api.get<DiscogsDetails>(`/api/discogs/${id}`)
    
    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}
