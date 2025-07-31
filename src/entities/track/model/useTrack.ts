import { ref } from 'vue'
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import type { DatabaseService } from '~shared/api'
import type { TrackLyricsResponse, ExternalTrackLyricsResponse } from '~entities/track'

const useTrack = (id: string, dbService: DatabaseService) => {
  const queryClient = useQueryClient()
  const externalLyrics = ref<ExternalTrackLyricsResponse[]>([])

  const { data: lyricsRes, isFetched: isLyricsFetched } = useQuery<TrackLyricsResponse>({
    queryKey: ['track', id],
    queryFn: () => dbService.getEntityPage<TrackLyricsResponse>(`tracks/${id}`, 'lyrics')
  })

  const { mutateAsync: saveLyrics } = useMutation({
    mutationFn: (lyrics: string) => {
      return dbService.updateEntity('tracks', { _id: id, lyrics })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['track', id] })
    }
  })

  const { mutateAsync: fetchExternalLyrics, isPending: isFetchingExternalLyrics } = useMutation({
    mutationFn: (searchQuery: string) => {
      return dbService.getEntityPage<ExternalTrackLyricsResponse[]>(`tracks`, `lyrics/search?query=${searchQuery}`)
    },
    onSuccess: (data) => {
      if (!data?.length) {
        throw new Error('No lyrics found')
      }

      externalLyrics.value = data
    }
  })

  return {
    lyricsRes,
    isLyricsFetched,
    isFetchingExternalLyrics,
    fetchExternalLyrics,
    externalLyrics,
    saveLyrics
  }
}

export default useTrack
