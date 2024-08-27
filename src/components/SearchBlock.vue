<template>
  <div
    :class="[{
      '--small' : size === 'small',
      '--medium' : size === 'medium',
      '--large' : size === 'large',
      '--inverted' : isInverted,
      '--focused' : isFocused
    }, 'input-search']"
  >
    <div
      :class="[{ '--button' : !isFocused && !localValue }, 'input-search__icon']"
      @click="() => searchInput?.focus()"
    >
      <Sprite name="loupe" />
    </div>
    <input
      v-model="localValue"
      ref="searchInput"
      spellcheck="false"
      class="input-search__element"
      :type="type"
      :placeholder="placeholder"
      @blur="isFocused = false"
      @focus="isFocused = true"
    />
    <Button
      v-if="localValue && localValue.length > 2"
      icon="close"
      isText
      isInverted
      @click="() => localValue = ''"
    />
    <div
      v-if="results.length"
      class="input-search__results"
    >
      <div
        v-for="result in results"
        :key="result.key"
        class="input-search__results-block"
      >
        <div class="input-search__results-title">{{ localize(`navigation.${result.key}`) }}</div>
        <ul class="input-search__results-list">
          <li
            v-for="item in result.data"
            :key="item._id"
            class="input-search__results-item"
          >
            <component :is="getRowComponent(result.key, item)" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { coverPlaceholders, debounce } from '~/utils'
import useGlobalStore from '~/store/global'
import { SearchResultData, SearchResultState } from '~/types/Search'
import { TrackRes } from '~/types/ReqRes'
import { RouterLink } from 'vue-router'
import { hostString } from '~/utils'
import AlbumItem from '~/classes/AlbumItem'
import SearchBlockTrack from './SearchBlockTrack.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from '~/components/Button.vue'

interface Props {
  type: 'password' | 'text' | 'number' | 'search' | 'email' | 'tel'
  results: SearchResultState[]
  placeholder?: string
  isInverted?: boolean
  value?: string
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'setInputValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const searchInput = ref<HTMLInputElement>(null!)
const isFocused = ref(false)
const localValue = ref(props.value)

const emitInputValue = debounce((value: string) => {
  emit('setInputValue', value)
})

const getRowComponent = (key: string, data: SearchResultData) => {
  switch(key) {
    case 'albums':
      return h(
        RouterLink,
        { to: `/albums/${data._id}`, class: 'input-search__results-link' },
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
        { track: data as TrackRes }
      )
    default:
      return h(
        RouterLink,
        { to: `/${key}/${data._id}`, class: 'input-search__results-link' },
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

watch(
  localValue,
  (value) => value && emitInputValue(value),
  { immediate: false }
)
</script>

<style lang="scss">
@import '~/scss/variables';

.input-search {
  position: relative;
  display: flex;
  align-items: center;
  color: $paleDP;
  flex-grow: 1;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    max-width: 0;
    opacity: 0;
    background-color: $paleDP;
    transition: all 0.3s $animation;
  }

  &.--small {
    font-size: 0.875rem;

    .input-search__element {
      height: 30px;
    }
  }

  &.--medium {

    .input-search__element {
      height: 40px;
    }
  }

  &.--large {
    font-size: 1.25rem;

    .input-search__element {
      height: 50px;

      &:focus {
        color: $white;
      }
    }
  }

  &.--focused {

    &:after {
      max-width: 100%;
      opacity: 1;
      transition: all 0.3s $animation;
    }
  }

  &.--inverted {
    
    .input-search__element {

      &:focus {
        color: $white;
      }
    }
  }
  
  &__icon {
    .icon {
      color: inherit;
      fill: $paleDP;
      width: 22px;
      height: 22px;
      transform: scale(-1, 1);
      cursor: pointer;
    }
  }

  &__element {
    width: 100%;
    padding: 0;
    font-size: inherit;
    border: 0;
    border-radius: 0;
    outline: 0;
    color: inherit;
    background-color: transparent;
    padding-left: 0.5rem;
    
    &:focus {
      color: $paleDP;
    }

    &::placeholder {
      color: $paleDP;
    }
  }

  &__results {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    padding: 25px 0;
    background-color: $white;
    border-bottom-left-radius: $borderRadiusLG;
    border-bottom-right-radius: $borderRadiusLG;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    z-index: 3000;
    overflow: auto;
    max-height: calc(100vh - 150px);

    &-block {
      padding: 0.75rem 0;
      border-bottom: 1px solid $paleLT;

      &:first-of-type {
        padding-top: 0;
      }

      &:last-of-type {
        padding-bottom: 0;
        border-bottom: 0;
      }
    }

    &-title {
      @include serif(1rem);
      margin-bottom: 5px;
      padding: 0 25px;
    }

    &-link {
      display: flex;
      align-items: center;
      padding: 5px 25px;
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
}
</style>
