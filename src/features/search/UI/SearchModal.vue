<template>
  <SearchWrapper isWithFooter>
    <template #body>
      <TextInput
        name="search"
        type="text"
        size="large"
        isFocused
        :placeholder="localize('search.placeholder')"
        @onInput="debouncedSearch"
      />
      <SearchResults
        :isFetching="isFetching"
        :isEmpty="!results?.length"
      >
        <template #results>
          <SearchBlock
            v-for="result in results"
            :key="result.key"
            :block="result"
            :renderer="getRowComponent"
            :heading="localize(`navigation.${result.key}`)"
          ></SearchBlock>
        </template>
      </SearchResults>
    </template>
    <template #footer>
      {{ localize('search.byAlbum') }} &nbsp;&bull;&nbsp;
      {{ localize('search.byArtist') }} &nbsp;&bull;&nbsp;
      {{ localize('search.byGenre') }} &nbsp;&bull;&nbsp;
      {{ localize('search.byPeriod') }} &nbsp;&bull;&nbsp;
      {{ localize('search.byTrack') }}
    </template>
  </SearchWrapper>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { debounce, hostString, coverPlaceholders } from '~shared/utils'
import { useLocalization } from '~shared/model'
import { TextInput } from '~shared/UI'
import SearchWrapper from './SearchWrapper.vue'
import SearchResults from './SearchResults.vue'
import SearchBlock from './SearchBlock.vue'
import SearchBlockTrack from './SearchBlockTrack.vue'
import type { SearchResultState, SearchResultData } from '../lib/types'
import type { AlbumBasic } from '~entities/album'
import type { TrackBasic } from '~/entities/track'

interface Props {
  isFetching: boolean
  results: SearchResultState[] | undefined
}

interface Emits {
  (e: 'onSearch', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const debouncedSearch = debounce((value: string) => {
  emit('onSearch', value)
})

const getRowComponent = (key: string, data: SearchResultData) => {
  switch(key) {
    case 'albums':
      return h(
        RouterLink,
        { to: `/albums/${data._id}`, class: 'search__block-action' },
        [
          h(
            'img',
            { src: (data as AlbumBasic).coverURL },
          ),
          h(
            'div',
            {},
            [
              h(
                'strong',
                {},
                (data as AlbumBasic).title
              ),
              h(
                'span',
                {},
                (data as AlbumBasic).artist?.title
              )
            ]
          )
        ]
      )
    case 'tracks':
      return h(
        SearchBlockTrack,
        { track: data as TrackBasic }
      )
    default:
      return h(
        RouterLink,
        { to: `/${key}/${data._id}`, class: 'search__block-action' },
        [
          h(
            'img',
            { src: 'avatar' in data ? hostString(String(data.avatar)) : coverPlaceholders(key) },
          ),
          h(
            'strong',
            {},
            data.title
          )
        ]
      )
  }
}
</script>
