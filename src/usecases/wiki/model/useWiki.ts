import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { MinimumAlbumInfo } from '~shared/model'
import type WikiService from '../api/WikiService'

const useWiki = (entity: MinimumAlbumInfo, wikiService: WikiService) => {
  const wikiFrameURL = ref('')
  const wikiPageID = ref<string | null>(null)
  const wikiFrameResults = ref(null)

  const isWikiPageLoadingEnabled = computed(() => (
    !!wikiPageID.value
  ))

  const resetWikiData = () => {
    wikiFrameURL.value = ''
    wikiFrameResults.value = null
  }

  const detectWikiLocale = (str: string | undefined) => {
    if (!str) return

    if (str.match(/[a-zA-Z]/g)) {
      return 'en'
    } else if (str.match(/[а-яА-Я]/g)) {
      return 'ru'
    }
  
    return 'en'
  }

  const prepareSearchParams = () => {
    resetWikiData()

    const albumLang = detectWikiLocale(entity.albumTitle)
    const artistLang = detectWikiLocale(entity.albumArtist)
    let wikiLang = 'en'

    if (!albumLang || !artistLang) false

    if (albumLang === 'ru' || artistLang === 'ru') {
     wikiLang = 'ru'
    }

    wikiService.setLang(wikiLang)
    return true
  }

  const {
    isFetching: isWikiSearching,
    data: wikiSearchResults
  } = useQuery<{ results: WikiSearchResult[] }>({
    retry: 3,
    refetchOnWindowFocus: false,
    queryKey: [entity],
    queryFn: () => {
      if (prepareSearchParams()) {
        return wikiService.search(`${entity.albumArtist} - ${entity.albumTitle}`)
      }

      throw new Error('Wiki search params is not defined')
    }
  })

  const {
    isFetching: isWikiPageLoading,
    data: wikiPageData,
    isFetched: isWikiPageFetched
  } = useQuery<{ canonicalurl: string }>({
    retry: 3,
    enabled: isWikiPageLoadingEnabled,
    refetchOnWindowFocus: false,
    queryKey: [wikiPageID],
    queryFn: () => {
      return wikiService.getPage(String(wikiPageID.value))
    }
  })

  watch(
    isWikiPageFetched,
    (isFetched) => {
      if (isFetched) {
        wikiFrameURL.value = wikiPageData.value?.canonicalurl || ''
      }
    }
  )

  return {
    isWikiSearching,
    isWikiPageLoading,
    wikiSearchResults,
    wikiFrameURL,
    wikiPageID
  }
}

export default useWiki
