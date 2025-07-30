import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query'
import type { DatabaseService } from '~shared/api'
import type { TrackLyricsResponse } from '~entities/track'

const useTrack = (id: string, dbService: DatabaseService) => {
  const queryClient = useQueryClient()

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

  return {
    lyricsRes,
    isLyricsFetched,
    saveLyrics
  }
}

export default useTrack
