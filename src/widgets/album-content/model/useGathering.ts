import { ref, type Ref } from 'vue'
import type { DatabaseService } from '~shared/api'
import { useGetPage } from '~shared/model'

const useGathering = <T extends GatheringBasic>(dbService: DatabaseService, entityKey: Ref<string>) => {
  const preRandomState = ref('')
  const pageEntityKey = ref(entityKey)

  const {
    data: gathering,
    isFetched: isGatheringFetched
  } = useGetPage<T>(
    pageEntityKey,
    dbService,
    preRandomState
  )

  return {
    gathering,
    isGatheringFetched,
    preRandomState
  }
}

export default useGathering
