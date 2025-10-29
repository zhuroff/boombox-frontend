<template>
  <div class="album">
    <slot name="hero"></slot>
    <div
      v-if="!noMobileContent || !isMobile"
      :class="`album__content --${cardsTemplate}`"
    >
      <div
        class="album__main"
        ref="albumContent"
      >
        <slot name="content"></slot>
      </div>
      <div
        v-for="{ name, docs } in relatedAlbums"
        :key="name"
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
    <footer
      v-if="!isMobile"
      :class="`album__footer --${cardsTemplate}`"
    >
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useLocalization, useDevice } from '~shared/model'
import { EntityCardList, type UnifiedEntityCard } from '~widgets/entity-cards'
import type { RelatedAlbums } from '~shared/lib'

interface Props {
  entityKey: string
  relatedAlbums?: RelatedAlbums<UnifiedEntityCard>[]
  cardsTemplate?: 'col' | 'row' | 'offset'
  noMobileContent?: boolean
}

withDefaults(defineProps<Props>(), {
  cardsTemplate: 'col',
  noMobileContent: false
})

const { isMobile } = useDevice()
const { localize } = useLocalization()
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.album {
  flex: 1 1 0;
  position: relative;

  @include var.media('<desktop') {
    min-height: 100vh;
  }

  &__content {
    flex: 1 1 0;
    position: relative;    

    @include var.media('<desktop') {
      border-top-left-radius: var.$borderRadiusMD;
      border-top-right-radius: var.$borderRadiusMD;
      background-color: var.$paleLW;
      margin-top: calc(100vw + 7rem);
      padding: var.$minPadding 0 3.5rem;
      z-index: 9000;

      @include var.media('landscape') {
        margin-top: 80vh;
      }
    }

    @include var.media('>=desktop') {
      padding: var.$mainPadding;

      &:not(.--row) {
        display: grid;
        grid-template-columns: 1fr 200px 200px;
        gap: 1rem;
      }
    }

    @include var.media('>=desktop-md') {
      &:not(.--row) {
        grid-template-columns: 1fr 250px 250px;
      }
    }

    @include var.media('>=desktop-lg') {
      &:not(.--row) {
        grid-template-columns: 1fr 275px 275px;
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

    @include var.media('<desktop') {
      width: 100vw;
      padding: calc(110px + 1rem) 1rem 2rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: var.$black;

      iframe {
        width: 100% !important;
        max-width: 400px !important;
        border-radius: var.$borderRadiusMD;
        overflow: hidden;
        margin-bottom: 3rem;
      }
    }

    @include var.media('>=desktop') {
      width: var.$coverWidth;
      margin-bottom: var.$mainPadding;
    }
  }

  &__related {

    @include var.media('<desktop') {
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
