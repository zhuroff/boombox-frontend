import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { AlbumVinylFilter, RequestConfig } from '~shared/lib'

const parseVinylFilter = (value: unknown): AlbumVinylFilter => {
  if (value === 'onVinyl' || value === 'notOnVinyl') {
    return value
  }

  return 'all'
}

const useAlbumVinylFilter = () => {
  const route = useRoute()
  const router = useRouter()

  const vinylFilter = ref<AlbumVinylFilter>(parseVinylFilter(route.query.vinylFilter))

  watch(
    () => route.query.vinylFilter,
    (value) => {
      vinylFilter.value = parseVinylFilter(value)
    }
  )

  const setVinylFilter = (value: AlbumVinylFilter) => {
    vinylFilter.value = value

    const query: LocationQueryRaw = { ...route.query, page: '1' }

    if (value === 'all') {
      delete query.vinylFilter
    } else {
      query.vinylFilter = value
    }

    router.push({ query })
  }

  const requestConfigPart = computed<Partial<RequestConfig>>(() =>
    vinylFilter.value === 'all' ? {} : { vinylFilter: vinylFilter.value }
  )

  return {
    vinylFilter,
    setVinylFilter,
    requestConfigPart
  }
}

export default useAlbumVinylFilter
