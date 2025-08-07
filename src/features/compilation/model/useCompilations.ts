import { ref, computed, watch } from 'vue'
import { useCreateEntity, useGetList, usePaginator, useUpdateEntity } from '~shared/model'
import type { CompilationBasic } from '~entities/compilation'
import type { TrackBasic } from '~entities/track'
import type { DatabaseService } from '~shared/api'
import type { ListPageResponse, NewGatheringPayload, UpdateGatheringPayload } from '~shared/lib'

const useCompilations = (
  track: TrackBasic,
  dbService: DatabaseService
) => {
  const compilations = ref<CompilationBasic[]>([])
  const compilationEntityKey = ref('compilations')
  const isCompilationsModalEnabled = ref(false)

  const { paginationState: compilationsPagination } = usePaginator({ isRouted: false })

  const compilationsConfig = computed(() => ({
    pageID: track._id,
    entityKey: compilationEntityKey.value,
    requestConfig: compilationsPagination
  }))

  const isGatheringFetching = computed(() => (
    isCreating.value || isUpdating.value || isCompilationsFetching.value
  ))

  const {
    data: initialCompilations,
    isFetching: isCompilationsFetching,
  } = useGetList<CompilationBasic>(
    compilationsConfig,
    dbService,
    isCompilationsModalEnabled
  )

  const {
    createdEntity,
    createEntity,
    isCreating
  } = useCreateEntity<ListPageResponse<CompilationBasic>, NewGatheringPayload>(
    compilationEntityKey,
    dbService
  )
  
  const {
    updatedEntity,
    updateEntity,
    isUpdating
  } = useUpdateEntity<ListPageResponse<CompilationBasic>, UpdateGatheringPayload>(
    compilationEntityKey,
    dbService
  )

  const selectCompilation = async (payload: Pick<UpdateGatheringPayload, 'isInList' | 'gatheringID'>) => {
    await updateEntity({
      ...payload,
      entityType: compilationEntityKey.value,
      entityID: track._id,
      order: payload.isInList ? -1 : 1
    })
  }
  
  const createCompilation = (title: string) => {
    createEntity({
      title,
      entityID: track._id
    })
  }

  watch(
    [initialCompilations, updatedEntity, createdEntity],
    ([a, b, c], [oldA, oldB, oldC]) => {
      if (!!a && a !== oldA) {
        compilations.value = a?.docs
      } else if (!!b && b !== oldB) {
        compilations.value = b.docs
      } else if (!!c && c !== oldC) {
        compilations.value = c.docs
      }
    }
  )

  return {
    compilations,
    selectCompilation,
    createCompilation,
    isGatheringFetching,
    isCompilationsModalEnabled
  }
}

export default useCompilations
