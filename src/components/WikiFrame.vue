<template>
  <div class="wikiframe">
    <ul
      v-if="searchResults"
      class="wikiframe__results"
    >
      <li
        v-for="result in searchResults"
        :key="result.pageid"
        :class="[{ '--selected' : selected === result.pageid }, 'wikiframe__results-item']"
        @click="() => selectWikiResult(result.pageid)"
      >{{ result.title }}</li>
    </ul>
    <div
      v-if="!isLoading && !frameURL"
      class="wikiframe__placeholder"
    >{{ lang('wiki.frameHeading') }}</div>
    <iframe
      v-if="frameURL"
      :src="frameURL"
      frameborder="0"
      class="wikiframe__content"
    ></iframe>
    <Preloader
      v-if="isLoading"
      mode="dark"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, ref } from 'vue'
import { WikiSearchResult } from '~/types/Global'
import { useLocales } from '~/hooks/useLocales'
import Preloader from './Preloader.vue'

export default defineComponent({
  name: 'WikiFrame',
  components: {
    Preloader
  },
  props: {
    frameURL: {
      type: String,
      required: false
    },
    searchResults: {
      type: Array as PropType<WikiSearchResult[]>,
      required: false
    },
    isLoading: {
      type: Boolean,
      required: true
    }
  },

  setup(_, { emit }) {
    const { lang } = useLocales()
    const selected = ref<number>(-1)

    const selectWikiResult = (id: number) => {
      selected.value = id
      emit('selectWikiResult', id)
    }

    return {
      lang,
      selected,
      selectWikiResult
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.wikiframe {
  width: calc(100vw - 20px);
  height: calc(100vh - 50px);
  max-width: 1200px;
  max-height: calc(100vh - 50px);
  overflow: hidden;
  background-color: $white;
  border-radius: $borderRadiusLG;
  position: relative;
  display: flex;
  flex-direction: column;

  &__results {
    padding: 25px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;

    &-item {
      font-size: 0.875rem;
      color: $paleDP;
      cursor: pointer;
      text-align: center;

      &:hover {
        color: $dark;
      }

      &.--selected {
        color: $dark;
        font-weight: 600;
      }
    }
  }

  &__placeholder {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }

  &__content {
    width: 100%;
    height: 100%;
  }
}
</style>
