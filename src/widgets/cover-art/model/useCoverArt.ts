import { computed, ref, type Ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { DatabaseService } from '~shared/api'
import { isRegularAlbum } from '~entities/album'
import { isTOYAlbum } from '~entities/toy'
import type { ExcludeFromUnifiedEntityCard } from '~widgets/entity-cards'

type UnifiedAlbum = ExcludeFromUnifiedEntityCard<'CategoryBasic'>

type QueryPredicate = (album: UnifiedAlbum | undefined) => boolean
type QueryFormatter = (album: UnifiedAlbum) => string

const useCoverArt = (
  entityKey: string,
  entity: Ref<UnifiedAlbum | undefined>,
  dbService: DatabaseService
) => {
  const isActive = ref(false)
  const limit = 10
  const offset = ref(0)
  const totalItems = ref(0)
  const accumulatedBooklet = ref<string[]>([])
  const isCompleted = ref(false)
  const isInitialLoad = ref(true)
  const queryTrigger = ref(0)
  const shouldExecuteQuery = ref(false)

  const isQueryEnabled = computed(() => (
    isActive.value
    && !!entity.value
    && !isCompleted.value
    && shouldExecuteQuery.value
  ))

  const pathsMap = new Map<QueryPredicate, QueryFormatter>([
    [
      (album): album is undefined => !album,
      () => ''
    ],
    [
      (album): album is UnifiedAlbum => Boolean(album && isRegularAlbum(album)),
      (album) => `${album._id}/booklet`
    ],
    [
      (album): album is UnifiedAlbum => Boolean(album && isTOYAlbum(album)),
      (album) => {
        if (isTOYAlbum(album)) {
          return `${album.genre.title}/${album.period.title}/booklet`
        }
        return ''
      }
    ]
  ])

  const path = computed(() => {
    for (const [predicate, formatter] of pathsMap) {
      if (predicate(entity.value)) {
        return formatter(entity.value as UnifiedAlbum)
      }
    }
    return ''
  })

  const query = computed(() => `limit=${limit}&offset=${offset.value}&fileType=image`)

  const { data: booklet, isFetching } = useQuery<string[]>({
    retry: 3,
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
    queryKey: [entity, offset, queryTrigger],
    queryFn: () => dbService.getCloudFiles(entityKey, path.value, query.value)
  })

  watch(
    () => booklet.value,
    (newData) => {
      if (newData?.length) {
        if (isInitialLoad.value) {
          accumulatedBooklet.value = newData
          isInitialLoad.value = false
        } else {
          accumulatedBooklet.value = [
            ...accumulatedBooklet.value,
            ...newData
          ]
        }
        
        totalItems.value = accumulatedBooklet.value.length

        if (newData.length < limit) {
          isCompleted.value = true
        }
      }
    },
    { immediate: true }
  )

  const loadMoreImages = (currentIndex: number) => {
    const remainingItems = accumulatedBooklet.value.length - currentIndex
    
    if (remainingItems <= 3 && !isCompleted.value && !isFetching.value) {
      offset.value += limit
    }
  }

  const resetBooklet = () => {
    offset.value = 0
    accumulatedBooklet.value = []
    isCompleted.value = false
    totalItems.value = 0
    isInitialLoad.value = true
    shouldExecuteQuery.value = false
  }

  watch(isActive, (newValue) => {
    if (!newValue) {
      resetBooklet()
    } else {
      queryTrigger.value++
      setTimeout(() => {
        shouldExecuteQuery.value = true
      }, 0)
    }
  })

  return {
    booklet: computed(() => ({
      items: accumulatedBooklet.value,
      total: totalItems.value
    })),
    isFetching: computed(() => (
      isInitialLoad.value && isFetching.value
    )),
    loadMoreImages,
    resetBooklet,
    isActive
  }
}

export default useCoverArt
