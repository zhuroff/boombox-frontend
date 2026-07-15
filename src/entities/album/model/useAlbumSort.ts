import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { AlbumSortOption, RequestConfig } from '~shared/lib'
import { albumSortToSortingValue, DEFAULT_ALBUM_SORT, parseAlbumSort } from '../lib/albumSort'

const useAlbumSort = () => {
  const route = useRoute()
  const router = useRouter()

  const albumSort = ref<AlbumSortOption>(parseAlbumSort(route.query.albumSort))

  watch(
    () => route.query.albumSort,
    (value) => {
      albumSort.value = parseAlbumSort(value)
    }
  )

  const setAlbumSort = (value: AlbumSortOption) => {
    albumSort.value = value

    const query: LocationQueryRaw = { ...route.query, page: '1' }

    if (value === DEFAULT_ALBUM_SORT) {
      delete query.albumSort
    } else {
      query.albumSort = value
    }

    router.push({ query })
  }

  const requestConfigPart = computed<Partial<RequestConfig>>(() => ({
    sort: albumSortToSortingValue(albumSort.value)
  }))

  return {
    albumSort,
    setAlbumSort,
    requestConfigPart
  }
}

export default useAlbumSort
