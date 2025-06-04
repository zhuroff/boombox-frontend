import { ref } from 'vue'
import { useGetPage } from '~shared/model'
import type { DatabaseService } from '~shared/api'
import type { CompilationBasic } from '~entities/compilation'

const useCompilation = (dbService: DatabaseService) => {
  const preRandomState = ref('')
  const entityKey = ref('compilations')

  const {
    data,
    isFetched
  } = useGetPage<CompilationBasic>(
    entityKey,
    dbService,
    preRandomState
  )

  return {
    compilation: data,
    isFetched,
    preRandomState
  }
}

export default useCompilation
