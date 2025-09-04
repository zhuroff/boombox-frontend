import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref, ComputedRef } from 'vue'
import type DatabaseService from '~/shared/api/DatabaseService'

const useUpdateEntity = <T, U>(
  entityKey: Ref<string>,
  dbService: DatabaseService,
  id?: ComputedRef<string | null>
) => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: updateEntity,
    isPending: isUpdating,
    isSuccess: isUpdated,
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

  const {
    mutateAsync: reorderEntities,
    isPending: isReordering,
    error: reorderEntitiesError,
    data: reorderedEntities
  } = useMutation({
    mutationFn: (payload: U) => {
      if (!id?.value) {
        throw new Error('Entity id is not defined')
      }

      return dbService.reorderEntities<T, U>(entityKey.value, id.value, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] })
    },
    onError: (error) => {
      console.error(error)
    }
  })

  return {
    updateEntityError,
    updatedEntity,
    updateEntity,
    isUpdating,
    isUpdated,
    reorderEntities,
    isReordering,
    reorderEntitiesError,
    reorderedEntities
  }
}

export default useUpdateEntity
