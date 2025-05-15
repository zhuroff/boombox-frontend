import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import { usePaginator } from '~widgets/paginator'
import { useGetList, useCreateEntity, useUpdateEntity } from '~/shared/model'
import type DatabaseService from '~/shared/api/DatabaseService'

const useCollections = (album: Ref<Album, Album> | Ref<undefined, undefined>, dbService: DatabaseService) => {
  const collections = ref<GatheringBasic[]>([])
  const collectionEntityKey = ref('collections')
  const isCollectionsModalEnabled = ref(false)
  const newCollectionPayload = ref<GatheringCreateReq | null>(null)
  const collectionUpdatePayload = ref<GatheringUpdateReq | null>(null)

  const { paginationState: collectionsPagination } = usePaginator({ isRouted: false })

  const collectionsConfig = computed(() => ({
    pageID: album.value?._id,
    entityKey: 'collections',
    requestConfig: collectionsPagination
  }))

  const isNewCollectionQueryEnabled = computed(() => (
    !!newCollectionPayload.value
  ))
  
  const isUpdateCollectionQueryEnabled = computed(() => (
    !!collectionUpdatePayload.value
  ))

  const isGatheringFetching = computed(() => (
    isNewCollectionCreating.value || isCollectionUpdating.value || isCollectionsFetching.value
  ))

  const {
    data: initialCollections,
    isFetching: isCollectionsFetching,
  } = useGetList<GatheringBasic>(
    collectionsConfig,
    dbService,
    isCollectionsModalEnabled
  )

  const {
    data: increasedCollections,
    isFetching: isNewCollectionCreating,
  } = useCreateEntity<ListPageResponse<GatheringBasic>, GatheringCreateReq>(
    collectionEntityKey,
    newCollectionPayload,
    dbService,
    isNewCollectionQueryEnabled
  )
  
  const {
    data: updatedCollections,
    isFetching: isCollectionUpdating,
  } = useUpdateEntity<GatheringBasic, GatheringUpdateReq>(
    collectionEntityKey,
    collectionUpdatePayload,
    dbService,
    isUpdateCollectionQueryEnabled
  )

  const selectCollection = (payload: Pick<GatheringUpdateReq, 'isInList' | 'gatheringID'>) => {
    if (!album.value?._id) {
      throw new Error('Album has not been fetched yet')
    }
  
    collectionUpdatePayload.value = {
      ...payload,
      entityType: 'collections',
      entityID: album.value._id,
      order: payload.isInList ? -1 : 1
    }
  }
  
  const createCollection = (title: string) => {
    if (!album.value?._id) {
      throw new Error('Album has not been fetched yet')
    }
  
    newCollectionPayload.value = {
      title,
      entityID: album.value._id
    }
  }

  watch(
    [initialCollections, updatedCollections, increasedCollections],
    ([a, b, c], [oldA, oldB, oldC]) => {
      newCollectionPayload.value = null
      collectionUpdatePayload.value = null
      
      if (!!a && a !== oldA) {
        collections.value = a?.docs
      } else if (!!b && b !== oldB) {
        collections.value = b.docs
      } else if (!!c && c !== oldC) {
        collections.value = c.docs
      }
    }
  )

  onUnmounted(() => {
    newCollectionPayload.value = null
    collectionUpdatePayload.value = null
  })

  return {
    collections,
    selectCollection,
    createCollection,
    isGatheringFetching,
    isCollectionsModalEnabled
  }
}

export default useCollections
