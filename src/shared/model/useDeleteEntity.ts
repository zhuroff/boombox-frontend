import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { ListPageResponse } from '../lib'
import type DatabaseService from '~/shared/api/DatabaseService'

const useDeleteEntity = <T>(
  entityKey: Ref<string> | string,
  entityId: Ref<string | null>,
  dbService: DatabaseService,
) => {
  const queryClient = useQueryClient()

  const {
    mutateAsync: deleteEntity,
    isPending: isDeleting,
    error: deleteEntityError,
    data: deletedEntity
  } = useMutation({
    mutationFn: () => (
      dbService.deleteEntity<ListPageResponse<T>>(
        typeof entityKey === 'string' ? entityKey : entityKey.value,
        entityId.value
      )
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityKey] })
    }
  })

  return {
    deleteEntityError,
    deletedEntity,
    deleteEntity,
    isDeleting
  }
}

export default useDeleteEntity
