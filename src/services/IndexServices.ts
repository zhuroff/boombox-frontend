import api from '~/api'

export default class AlbumServices {
  static async getRandomAlbums(quantity = 11) {
    const response = await api.get<any>('/api/albums', { params: { quantity } })

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
