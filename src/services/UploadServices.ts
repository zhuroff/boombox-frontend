import { ImagePayload } from '~/types/Global'
import api from '~/api'

export default class UploadServices {
  static async uploadImage<T>({ file, type, slug, id }: ImagePayload): Promise<T> {
    const formData = new FormData()
    const url = `/api/${slug}/${id}/${type}`

    formData.append(type, file)

    const response = await api.post<T>(url, formData)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
