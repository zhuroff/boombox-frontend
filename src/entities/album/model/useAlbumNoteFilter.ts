import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { AlbumNoteFilter, RequestConfig } from '~shared/lib'

const parseNoteFilter = (value: unknown): AlbumNoteFilter => {
  if (value === 'withReviews' || value === 'withoutReviews') {
    return value
  }

  return 'all'
}

const useAlbumNoteFilter = () => {
  const route = useRoute()
  const router = useRouter()

  const noteFilter = ref<AlbumNoteFilter>(parseNoteFilter(route.query.noteFilter))

  watch(
    () => route.query.noteFilter,
    (value) => {
      noteFilter.value = parseNoteFilter(value)
    }
  )

  const setNoteFilter = (value: AlbumNoteFilter) => {
    noteFilter.value = value

    const query: LocationQueryRaw = { ...route.query, page: '1' }

    if (value === 'all') {
      delete query.noteFilter
    } else {
      query.noteFilter = value
    }

    router.push({ query })
  }

  const requestConfigPart = computed<Partial<RequestConfig>>(() =>
    noteFilter.value === 'all' ? {} : { noteFilter: noteFilter.value }
  )

  return {
    noteFilter,
    setNoteFilter,
    requestConfigPart
  }
}

export default useAlbumNoteFilter
