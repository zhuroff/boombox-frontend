import api from '~/api'
import { RadioConfig, RadioStationResponse } from '~/types/Radio'

export default class RadioServices {
  static async savedStations() {
    const response = await api.get('/api/radio')

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async allStations({ genre, offset }: RadioConfig) {
    const response = await api.post<RadioStationResponse[]>('/api/radio', { genre, offset })

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
