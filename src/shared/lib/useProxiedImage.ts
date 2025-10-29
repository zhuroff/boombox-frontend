import { computed, type Ref } from 'vue'
import { proxyCloudUrl } from './proxyCloudUrl'

export const useProxiedImage = (imageUrl: Ref<string | undefined> | string | undefined) => {
  return computed(() => {
    const url = typeof imageUrl === 'string' ? imageUrl : imageUrl?.value
    return proxyCloudUrl(url)
  })
}

