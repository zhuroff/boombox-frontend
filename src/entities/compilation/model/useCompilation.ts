import { ref } from 'vue'
import { useGetPage } from '~shared/model'
import type { DatabaseService } from '~shared/api'
import type { CompilationFull } from '~entities/compilation'

const useCompilation = (dbService: DatabaseService) => {
  const preRandomState = ref('')
  const entityKey = ref('compilations')

  const { data, queryClient, isFetched, queryKey } = useGetPage<CompilationFull>(
    entityKey,
    dbService,
    preRandomState
  )

  const updateCompilationValue = <T extends keyof CompilationFull>(key: T, value: CompilationFull[T]) => {
    queryClient.setQueryData<CompilationFull>(queryKey, (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        [key]: value,
      }
    })
  }

  return {
    compilation: data,
    isFetched,
    preRandomState,
    updateCompilationValue
  }
}

export default useCompilation
