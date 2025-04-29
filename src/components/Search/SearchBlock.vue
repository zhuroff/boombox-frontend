<template>
  <div class="search">
    <div class="search__body">
      <TextInput
        name="search"
        type="text"
        placeholder="search.placeholder"
        size="large"
        isFocused
        @onInput="debouncedSearch"
      />
      <div class="search__results">
        <Preloader v-if="isFetching" mode="light" />
        <div
          v-if="!results?.length"
          class="search__empty"
        >
          There are no results
        </div>
        <div
          v-else
          class="search__data"
        >
          <div
            v-for="result in results"
            :key="result.key"
            class="search__block"
          >
            <div class="search__block-title">{{ localize(`navigation.${result.key}`) }}</div>
            <ul class="search__block-list">
              <li
                v-for="item in result.data"
                :key="item._id"
                class="search__block-item"
              >
                <component :is="getRowComponent(result.key, item)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <footer class="search__footer">
      By album &nbsp;&bull;&nbsp;
      By artist &nbsp;&bull;&nbsp;
      By genre &nbsp;&bull;&nbsp;
      By period &nbsp;&bull;&nbsp;
      By track
    </footer>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { debounce, hostString, coverPlaceholders } from '~/utils'
import useGlobalStore from '~/store/global'
import Preloader from '~/components/Preloader.vue'
import TextInput from '../Form/TextInput.vue'
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
