import api from '~/api'
import commonServices from './common.services'
import type { ImagePayload } from '~/types/Common'

export default {
  async uploadImage<T>({ file, type, slug, id }: ImagePayload): Promise<T> {
    const formData = new FormData()
    const url = `/api/${slug}/${id}/${type}`

    formData.append(type, file)
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    commonServices.errorChecker(response.status)
    return response.data
  }
}
