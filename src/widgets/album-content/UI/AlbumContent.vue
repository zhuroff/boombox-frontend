<template>
  <div class="album">
    <slot name="hero"></slot>
    <div :class="`album__content --${cardsTemplate}`">
      <div
        class="album__main"
        ref="albumContent"
      >
        <slot name="content"></slot>
      </div>
      <div
        v-for="{ name, docs } in relatedAlbums"
        :class="`album__related --${cardsTemplate}`"
      >
        <div class="album__related-title">
          {{ localize('moreOf') }} {{ name }}
        </div>
        <EntityCardList
          :entities="docs"
          :entityKey="entityKey"
          :isDraggable="false"
          :isDeletable="false"
          :template="cardsTemplate"
          placeholderPreview="/img/album.webp"
        />
      </div>
    </div>
    <footer :class="`album__footer --${cardsTemplate}`">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useLocalization } from '~shared/model'
import type { RelatedAlbums } from '~shared/lib'
import { EntityCardList, type UnifiedEntityCard } from '~widgets/entity-cards'

interface Props {
  entityKey: string
  relatedAlbums?: RelatedAlbums<UnifiedEntityCard>[]
  cardsTemplate?: 'col' | 'row' | 'offset'
}

withDefaults(defineProps<Props>(), {
  cardsTemplate: 'col'
})

const { localize } = useLocalization()
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.album {
  flex: 1 1 0;
  position: relative;

  &__content {
    flex: 1 1 0;
    padding: var.$mainPadding;
    position: relative;

    @include var.media('<laptop') {
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      margin-top: 100vw;
      background-color: var.$paleLT;
    }

    @include var.media('>=laptop') {
      &:not(.--row) {
        display: grid;
        grid-template-columns: calc(100% - (19.48% * 2) - 2rem) 19.48% 19.48%;
        gap: 1rem;
      }
    }

    @include var.media('>=desktop-lg') {
      &:not(.--row) {
        grid-template-columns: calc(100% - (260px * 2) - 2rem) 260px 260px;
      }
    }

    @include var.media('>=desktop-hg') {
      &:not(.--row) {
        max-width: 1700px;
      }
    }
  }

  &__main {
    position: relative;
  }

  &__frame {
    position: relative;
    margin-bottom: var.$mainPadding;
    width: var.$coverWidth;
  }

  &__related {

    @include var.media('<laptop') {
      margin-bottom: var.$mainPadding;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &-title {
      font-weight: 600;
      text-align: center;
      margin-bottom: 0.75rem;
    }

    &.--row {
      max-width: calc(100% - var.$coverWidth - var.$mainPadding + var.$basicPadding);
      margin-left: auto;
      margin-bottom: var.$mainPadding;

      .album__related-title {
        text-align: left;
        margin-left: var.$basicPadding;
      }
    }
  }

  &__footer {
    margin: var.$mainPadding;

    &.--row {
      max-width: calc(100% - var.$coverWidth - (var.$mainPadding * 2) - (var.$basicPadding * 2));
      margin-left: auto;
    }
  }
}
</style>
