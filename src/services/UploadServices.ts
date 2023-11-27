import api from '~/api'
import CommonService from './CommonService'
import { ImagePayload } from '~/types/Global'

export default class UploadServices {
  static async uploadImage<T>({ file, type, slug, id }: ImagePayload): Promise<T> {
    const formData = new FormData()
    const url = `/api/${slug}/${id}/${type}`

    formData.append(type, file)
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    CommonService.errorChecker(response.status)
    return response.data
  }
}
