import { CategoryKeys } from '~/types/Category'
import { FrameAlbum, FrameAlbumResponse, FramePayload } from '~/types/Frame'
import { RequestConfig, ResponseMessage } from '~/types/Global'
import api from '~/api'

export default class FrameServices {
  static async create(payload: FramePayload) {
    const response = await api.post<FrameAlbum>('/api/frames/create', payload)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async list(config: RequestConfig) {
    const response = await api.post<FrameAlbumResponse>('/api/frames', config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async single(id: string) {
    const response = await api.get<FrameAlbum>(`/api/frames/${id}`)
    
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
