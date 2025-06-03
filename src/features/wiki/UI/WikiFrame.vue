<template>
  <div class="wikiframe">
    <ul
      v-if="wikiSearchResults?.results?.length"
      class="wikiframe__results"
    >
      <li
        v-for="result in wikiSearchResults.results"
        :key="result.pageid"
        :class="[{ '--selected' : selected === result.pageid }, 'wikiframe__results-item']"
        @click="() => selectWikiResult(result.pageid)"
      >{{ result.title }}</li>
    </ul>
    <div
      v-if="!isLoading && !wikiFrameURL"
      class="wikiframe__placeholder"
    >
      {{
        wikiSearchResults?.results?.length
          ? localize('wiki.frameHeading')
          : 'Nothing was found'
      }}
    </div>
    <iframe
      v-if="wikiFrameURL"
      :src="wikiFrameURL"
      frameborder="0"
      class="wikiframe__content"
    ></iframe>
    <Loader
      v-if="isLoading"
      mode="light"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MinimumAlbumInfo } from '~shared/model'
import { Loader } from '~shared/UI'
import { useTranslate } from '~features/localization'
import { useWiki, WikiService } from '~features/wiki'

interface Props {
  entity: MinimumAlbumInfo
}

const props = defineProps<Props>()

const { localize } = useTranslate()

const wikiService = new WikiService()

const {
  isWikiSearching,
  isWikiPageLoading,
  wikiSearchResults,
  wikiFrameURL,
  wikiPageID
} = useWiki(props.entity, wikiService)

const selected = ref<number>(-1)

const isLoading = computed(() => (
  isWikiSearching.value || isWikiPageLoading.value
))

const selectWikiResult = (id: number) => {
  selected.value = id
  wikiPageID.value = String(id)
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.wikiframe {
  width: calc(100vw - 20px);
  height: calc(100vh - 50px);
  max-width: 1200px;
  max-height: calc(100vh - 50px);
  overflow: hidden;
  background-color: var.$white;
  border-radius: var.$borderRadiusLG;
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
      color: var.$paleDP;
      cursor: pointer;
      text-align: center;

      &:hover {
        color: var.$dark;
      }

      &.--selected {
        color: var.$dark;
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
