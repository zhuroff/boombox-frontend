import { useRoute } from 'vue-router'
import type { UploadService } from '~shared/api'
import type { ImagePayload, EntityImagesKeys } from '~entities/upload/model/types'

const useImageUploader = (entityKey: string, uploadService: UploadService) => {
  const route = useRoute()

  const uploadImage = async (type: EntityImagesKeys, file: File) => {
    const payload: ImagePayload = {
      file,
      type,
      slug: entityKey,
      id: String(route.params.id)
    }

    try {
      return await uploadService.uploadImage<Category>(payload)
    } catch (e) {
      console.error(e)
    }
  }

  return { uploadImage }
}

export default useImageUploader
