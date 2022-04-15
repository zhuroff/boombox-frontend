import { CategoryKeys } from '~/types/Category'
import { FrameBasic, FrameBasicResponse, FramePage } from '~/types/Frame'
import { RequestConfig, ResponseMessage } from '~/types/Global'
import api from '~/api'

export default class FrameServices {
  static async create(payload: FrameBasic) {
    const response = await api.post<FramePage>('/api/frames/create', payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async list(config: RequestConfig) {
    const response = await api.post<FrameBasicResponse>('/api/frames', config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async remove(id: string, payload: CategoryKeys) {
    const response = await api.post<ResponseMessage>(`/api/frames/${id}/delete`, payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
