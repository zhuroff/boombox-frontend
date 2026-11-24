import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { AlbumNoteFilter, RequestConfig } from '~shared/lib'

const NOTE_FILTER_STORAGE_KEY = 'album-note-filter'

const parseNoteFilter = (value: unknown): AlbumNoteFilter => {
  if (value === 'withNote' || value === 'withoutNote') {
    return value
  }

  return 'all'
}

const readStoredNoteFilter = (): AlbumNoteFilter => {
  try {
    return parseNoteFilter(localStorage.getItem(NOTE_FILTER_STORAGE_KEY))
  } catch {
    return 'all'
  }
}

const writeStoredNoteFilter = (value: AlbumNoteFilter) => {
  try {
    localStorage.setItem(NOTE_FILTER_STORAGE_KEY, value)
  } catch {
    // Storage can be unavailable in private mode. The filter still applies for this visit.
  }
}

const useAlbumNoteFilter = () => {
  const route = useRoute()
  const router = useRouter()

  const noteFilter = ref<AlbumNoteFilter>(
    route.query.noteFilter === undefined ? readStoredNoteFilter() : parseNoteFilter(route.query.noteFilter)
  )

  if (route.query.noteFilter !== undefined) {
    writeStoredNoteFilter(noteFilter.value)
  }

  watch(
    () => route.query.noteFilter,
    (value) => {
      const nextFilter = value === undefined ? noteFilter.value : parseNoteFilter(value)
      noteFilter.value = nextFilter
      writeStoredNoteFilter(nextFilter)
    }
  )

  const setNoteFilter = (value: AlbumNoteFilter) => {
    noteFilter.value = value
    writeStoredNoteFilter(value)

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
