import api from '~/api'
import { ResponseMessage } from '~/types/Global'
import { RadioConfig, RadioSavePayload, RadioStationResponse } from '~/types/Radio'

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

  static async save({ stationuuid, name }: RadioSavePayload) {
    const response = await api.post<ResponseMessage>(`/api/radio/${stationuuid}`, { stationuuid, name })

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error()
  }

  static async remove(stationuuid: string) {
    const response = await api.delete<ResponseMessage>(`/api/radio/${stationuuid}`)

    if (response?.status === 201) {
      return response.data.message
    }

    throw new Error()
  }
}
