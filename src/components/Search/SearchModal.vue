<template>
  <SearchWrapper isWithFooter>
    <template #body>
      <TextInput
        name="search"
        type="text"
        placeholder="search.placeholder"
        size="large"
        isFocused
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
      By album &nbsp;&bull;&nbsp;
      By artist &nbsp;&bull;&nbsp;
      By genre &nbsp;&bull;&nbsp;
      By period &nbsp;&bull;&nbsp;
      By track
    </template>
  </SearchWrapper>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { debounce, hostString, coverPlaceholders } from '~/utils'
import useGlobalStore from '~/store/global'
import SearchWrapper from './SearchWrapper.vue'
import SearchResults from './SearchResults.vue'
import SearchBlock from './SearchBlock.vue'
import { TextInput } from '~shared/UI'
import SearchBlockTrack from './SearchBlockTrack.vue'

interface Props {
  isFetching: boolean
  results: SearchResultState[] | undefined
}

interface Emits {
  (e: 'onSearch', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { globalGetters: { localize } } = useGlobalStore()

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
            { src: (data as AlbumItem).coverURL },
          ),
          h(
            'div',
            {},
            [
              h(
                'strong',
                {},
                (data as AlbumItem).title
              ),
              h(
                'span',
                {},
                (data as AlbumItem).artist?.title
              )
            ]
          )
        ]
      )
    case 'tracks':
      return h(
        SearchBlockTrack,
        { track: data as any }
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
