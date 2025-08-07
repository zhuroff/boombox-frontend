import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type DatabaseService from '~/shared/api/DatabaseService'

const useUpdateEntity = <T, U>(
  entityKey: Ref<string>,
  dbService: DatabaseService,
) => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: updateEntity,
    isPending: isUpdating,
    error: updateEntityError,
    data: updatedEntity
  } = useMutation({
    mutationFn: (payload: U) => (
      dbService.updateEntity<T, U>(entityKey.value, payload)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] })
    }
  })

  return {
    updateEntityError,
    updatedEntity,
    updateEntity,
    isUpdating
  }
}

export default useUpdateEntity
