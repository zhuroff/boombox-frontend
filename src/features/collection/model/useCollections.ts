import { computed, ref, watch, type Ref } from 'vue'
import { useGetList, useCreateEntity, useUpdateEntity } from '~shared/model'
import { usePaginator } from '~features/paginator'
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

  const { paginationState: collectionsPagination } = usePaginator({ isRouted: false })

  const collectionsConfig = computed(() => ({
    pageID: album.value?._id,
    entityKey: collectionEntityKey.value,
    requestConfig: collectionsPagination.value
  }))

  const isGatheringFetching = computed(() => (
    isCreating.value || isUpdating.value || isCollectionsFetching.value
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
    createdEntity,
    createEntity,
    isCreating
  } = useCreateEntity<ListPageResponse<CollectionBasic>, NewGatheringPayload>(
    collectionEntityKey,
    dbService
  )
  
  const {
    updatedEntity,
    updateEntity,
    isUpdating
  } = useUpdateEntity<ListPageResponse<CollectionBasic>, UpdateGatheringPayload>(
    collectionEntityKey,
    dbService
  )

  const selectCollection = (payload: Pick<UpdateGatheringPayload, 'isInList' | 'gatheringID'>) => {
    if (!album.value?._id) {
      throw new Error('Album has not been fetched yet')
    }

    updateEntity({
      ...payload,
      entityType: collectionEntityKey.value,
      entityID: album.value._id,
      order: payload.isInList ? -1 : 1
    })
  }
  
  const createCollection = (title: string) => {
    if (!album.value?._id) {
      throw new Error('Album has not been fetched yet')
    }

    createEntity({
      title,
      entityID: album.value._id
    })
  }

  watch(
    [initialCollections, updatedEntity, createdEntity],
    ([a, b, c], [oldA, oldB, oldC]) => {
      if (!!a && a !== oldA) {
        collections.value = a?.docs
      } else if (!!b && b !== oldB) {
        collections.value = b.docs
      } else if (!!c && c !== oldC) {
        collections.value = c.docs
      }
    }
  )

  return {
    collections,
    selectCollection,
    createCollection,
    isGatheringFetching,
    isCollectionsModalEnabled
  }
}

export default useCollections
