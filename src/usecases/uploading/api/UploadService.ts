import { api } from '~/shared/api'
import type { ImagePayload } from '~usecases/uploading'

export default class UploadService {
  uploadImage = async <T, U>({ file, type, slug, id }: ImagePayload<T>): Promise<U> => {
    try {
      const formData = new FormData()
      const url = `/api/${slug}/${id}/${type}`

      formData.append(String(type), file)

      const response = await api.post<U>(url, formData, {
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
