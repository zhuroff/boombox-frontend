import { ref, computed, watch, onUnmounted } from 'vue'
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
  const newCompilationPayload = ref<NewGatheringPayload | null>(null)
  const compilationUpdatePayload = ref<UpdateGatheringPayload | null>(null)

  const { paginationState: compilationsPagination } = usePaginator({ isRouted: false })

  const compilationsConfig = computed(() => ({
    pageID: track._id,
    entityKey: compilationEntityKey.value,
    requestConfig: compilationsPagination
  }))

  const isNewCompilationQueryEnabled = computed(() => (
    !!newCompilationPayload.value
  ))
  
  const isUpdateCompilationQueryEnabled = computed(() => (
    !!compilationUpdatePayload.value
  ))

  const isGatheringFetching = computed(() => (
    isNewCompilationCreating.value || isCompilationUpdating.value || isCompilationsFetching.value
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
    data: increasedCompilations,
    isFetching: isNewCompilationCreating,
  } = useCreateEntity<ListPageResponse<CompilationBasic>, NewGatheringPayload>(
    compilationEntityKey,
    newCompilationPayload,
    dbService,
    isNewCompilationQueryEnabled
  )
  
  const {
    data: updatedCompilations,
    isFetching: isCompilationUpdating,
  } = useUpdateEntity<CompilationBasic, UpdateGatheringPayload>(
    compilationEntityKey,
    compilationUpdatePayload,
    dbService,
    isUpdateCompilationQueryEnabled
  )

  const selectCompilation = (payload: Pick<UpdateGatheringPayload, 'isInList' | 'gatheringID'>) => {
    compilationUpdatePayload.value = {
      ...payload,
      entityType: compilationEntityKey.value,
      entityID: track._id,
      order: payload.isInList ? -1 : 1
    }
  }
  
  const createCompilation = (title: string) => {
    newCompilationPayload.value = {
      title,
      entityID: track._id
    }
  }

  watch(
    [initialCompilations, updatedCompilations, increasedCompilations],
    ([a, b, c], [oldA, oldB, oldC]) => {
      newCompilationPayload.value = null
      compilationUpdatePayload.value = null
      
      if (!!a && a !== oldA) {
        compilations.value = a?.docs
      } else if (!!b && b !== oldB) {
        compilations.value = b.docs
      } else if (!!c && c !== oldC) {
        compilations.value = c.docs
      }
    }
  )

  onUnmounted(() => {
    newCompilationPayload.value = null
    compilationUpdatePayload.value = null
  })

  return {
    compilations,
    selectCompilation,
    createCompilation,
    isGatheringFetching,
    isCompilationsModalEnabled
  }
}

export default useCompilations
