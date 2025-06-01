import api from '~/app/api'
import type { ImagePayload } from '../model/types'

export default class UploadService {
  uploadImage = async <T>({ file, type, slug, id }: ImagePayload): Promise<T> => {
    try {
      const formData = new FormData()
      const url = `/api/${slug}/${id}/${type}`

      formData.append(type, file)

      const response = await api.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return response.data
    } catch (error) {
      throw error
    }
  }
}
