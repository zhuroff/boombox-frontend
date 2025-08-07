import { useRoute } from 'vue-router'
import type { ImagePayload } from '../lib/types'
import type UploadService from '../api/UploadService'

const useImageUploader = (entityKey: string, uploadService: UploadService) => {
  const route = useRoute()

  const uploadImage = async <T, U>(type: T, file: File) => {
    const payload: ImagePayload<T> = {
      file,
      type,
      slug: entityKey,
      id: String(route.params.id)
    }

    try {
      return await uploadService.uploadImage<T, U>(payload)
    } catch (e) {
      throw e
    }
  }

  return { uploadImage }
}

export default useImageUploader
