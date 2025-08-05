import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import { usePaginator, useGetList, useCreateEntity, useUpdateEntity } from '~shared/model'
import type { AlbumBasic } from '~entities/album'
import type { CollectionBasic } from '~entities/collection'
import type { DatabaseService } from '~shared/api'
import type { ListPageResponse, NewGatheringPayload, UpdateGatheringPayload } from '~shared/lib'

const useCollections = (
  album: Ref<AlbumBasic, AlbumBasic> | Ref<undefined, undefined>,
  dbService: DatabaseService
) => {
  const collections = ref<CollectionBasic[]>([])
  const collectionEntityKey = ref('collections')
  const isCollectionsModalEnabled = ref(false)
  const newCollectionPayload = ref<NewGatheringPayload | null>(null)
  const collectionUpdatePayload = ref<UpdateGatheringPayload | null>(null)

  const { paginationState: collectionsPagination } = usePaginator({ isRouted: false })

  const collectionsConfig = computed(() => ({
    pageID: album.value?._id,
    entityKey: collectionEntityKey.value,
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
  } = useGetList<CollectionBasic>(
    collectionsConfig,
    dbService,
    isCollectionsModalEnabled
  )

  const {
    data: increasedCollections,
    isFetching: isNewCollectionCreating,
  } = useCreateEntity<ListPageResponse<CollectionBasic>, NewGatheringPayload>(
    collectionEntityKey,
    newCollectionPayload,
    dbService,
    isNewCollectionQueryEnabled
  )
  
  const {
    data: updatedCollections,
    isFetching: isCollectionUpdating,
  } = useUpdateEntity<CollectionBasic, UpdateGatheringPayload>(
    collectionEntityKey,
    collectionUpdatePayload,
    dbService,
    isUpdateCollectionQueryEnabled
  )

  const selectCollection = (payload: Pick<UpdateGatheringPayload, 'isInList' | 'gatheringID'>) => {
    if (!album.value?._id) {
      throw new Error('Album has not been fetched yet')
    }
  
    collectionUpdatePayload.value = {
      ...payload,
      entityType: collectionEntityKey.value,
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
