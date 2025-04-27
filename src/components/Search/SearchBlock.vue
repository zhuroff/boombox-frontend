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
        { to: `/albums/${data._id}`, class: 'search__block-link' },
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
        { to: `/${key}/${data._id}`, class: 'search__block-link' },
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

<style scoped lang="scss">
@import '~/scss/variables';
@import 'include-media';

.search {
  background-color: $white;
  border-radius: $borderRadiusMD;
  width: 100%;
  align-self: flex-start;
  overflow: hidden;

  @include media('>=laptop') {
    max-width: 650px;
  }

  &__body {
    padding: $minPadding $minPadding 0;
  }

  &__results {
    min-height: 120px;
    max-height: calc(100vh - #{$doublePadding * 4} - #{$minPadding * 2});
    display: flex;
    flex-direction: column;
    overflow: auto;
    margin: $minPadding 0;
    position: relative;
  }

  &__empty {
    flex: 1 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__block {
    padding: 0.75rem 0;

    &:first-of-type {
      padding-top: 0;
    }

    &:last-of-type {
      padding-bottom: 0;
      border-bottom: 0;
    }

    &-title {
      @include serif(1rem);
      margin-bottom: 5px;
      padding: 0 5px;
    }

    &-link {
      display: flex;
      align-items: center;
      padding: 5px;
      transition: background-color 0.3s $animation;

      &:hover {
        background-color: $paleLT;
        transition: background-color 0.3s $animation;
      }

      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: $borderRadiusSM;
        max-height: 100%;
        display: block;
        margin-right: 0.875rem;
      }

      strong {
        color: $black;
        display: block;
      }

      span {
        font-size: 0.875rem;
        color: $paleDP;
      }
    }
  }

  &__footer {
    font-size: 0.75rem;
    letter-spacing: 1px;
    text-align: center;
    padding: $minPadding;
    border-top: 1px solid $paleMD;
    color: $paleLT;
    background-color: $dark;
  }
}
</style>
