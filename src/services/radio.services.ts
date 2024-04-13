import api from '~/api'
import { ResponseMessage } from '~/types/Common'
import { RadioConfig, RadioSavePayload, RadioStation } from '~/types/Radio'
import commonServices from './common.services'

export default {
  async get(payload?: RadioConfig) {
    const response = await api.post<RadioStation[]>('/api/radio', payload || {})
    commonServices.errorChecker(response.status)
    return response.data
  },
  async save({ stationuuid, name }: RadioSavePayload) {
    const response = await api.post<ResponseMessage>(`/api/radio/${stationuuid}`, { stationuuid, name })
    commonServices.errorChecker(response.status)
    return response.data
  },
  async remove(stationuuid: string) {
    const response = await api.delete<ResponseMessage>(`/api/radio/${stationuuid}`)
    commonServices.errorChecker(response.status)
    return response.data
  }
}
