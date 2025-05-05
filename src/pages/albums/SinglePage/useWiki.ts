import { computed, ref, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import wiki from 'wikipedia'

const useWiki = (album: Ref<Album, Album> | Ref<undefined, undefined>) => {
  const wikiFrameURL = ref('')
  const wikiPageID = ref<string | null>(null)
  const wikiFrameResults = ref(null)
  const isWikiFrameEnabled = ref(false)

  const isWikiSearchEnabled = computed(() => (
    isWikiFrameEnabled.value && !!album.value
  ))

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

    const albumLang = detectWikiLocale(album.value?.title)
    const artistLang = detectWikiLocale(album.value?.artist.title)
    let wikiLang = 'en'

    if (!albumLang || !artistLang) false

    if (albumLang === 'ru' || artistLang === 'ru') {
     wikiLang = 'ru'
    }

    wiki.setLang(wikiLang)
    return true
  }

  const {
    isFetching: isWikiSearching,
    data: wikiSearchResults
  } = useQuery<{ results: WikiSearchResult[] }>({
    retry: 3,
    enabled: isWikiSearchEnabled,
    refetchOnWindowFocus: false,
    queryKey: [album],
    queryFn: () => {
      if (prepareSearchParams()) {
        return wiki.search(`${album.value?.artist.title} - ${album.value?.title}`)
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
      return wiki.page(String(wikiPageID.value))
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
    isWikiFrameEnabled,
    wikiSearchResults,
    wikiFrameURL,
    wikiPageID
  }
}

export default useWiki
