import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type DatabaseService from '~/shared/api/DatabaseService'

const useCreateEntity = <T, U extends {}>(
  entityKey: Ref<string>,
  dbService: DatabaseService,
) => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: createEntity,
    isPending: isCreating,
    error: createEntityError,
    data: createdEntity
  } = useMutation({
    mutationFn: (payload: U) => {
      let dynamicEntityKey = entityKey.value

      if ('__entityKey' in payload && payload.__entityKey) {
        dynamicEntityKey = String(payload.__entityKey)
        delete payload.__entityKey
      }

      return dbService.createEntity<T, U>(dynamicEntityKey, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] })
    }
  })

  return {
    createEntityError,
    createdEntity,
    createEntity,
    isCreating
  }
}

export default useCreateEntity
