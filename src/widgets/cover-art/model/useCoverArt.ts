import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { DatabaseService } from '~shared/api'

const useCoverArt = (dbService: DatabaseService, entity?: Entity & { path: string }) => {
  const isActive = ref(false)
  const limit: number = 10
  const offset: number = 0

  const isQueryEnabled = computed(() => (
    isActive.value && !!entity
  ))
  // api/albums/[ID]/booklet

  const { data } = useQuery<any>({
    retry: 3,
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    queryKey: [entity],
    queryFn: () => Promise.resolve([])
  })

  return {
    data,
    isActive
  }
}

export default useCoverArt
