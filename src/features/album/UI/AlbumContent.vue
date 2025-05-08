<template>
  <div class="album">
    <slot name="hero"></slot>
    <div class="album__content">
      <div
        class="album__main"
        ref="albumContent"
      >
        <slot name="content"></slot>
      </div>
      <div
        v-for="{ name, docs } in relatedAlbums"
        class="album__related"
      >
        <div class="album__related-title">
          {{ localize('moreOf') }} {{ name }}
        </div>
        <EntityCardList
          :entities="docs"
          :entityKey="entityKey"
          :isDraggable="false"
          :isDeletable="false"
          template="col"
          placeholderPreview="/img/album.webp"
        />
      </div>
    </div>
    <footer class="album__footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
import useGlobalStore from '~/store/global'
import { EntityCardList } from '~widgets/EntityCardList'

interface Props {
  relatedAlbums: RelatedAlbums[]
  entityKey: string
}

defineProps<Props>()

const { globalGetters: { localize } } = useGlobalStore()
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.album {
  flex: 1 1 0;
  position: relative;

  &__content {
    flex: 1 1 0;
    padding: 25px;
    position: relative;

    @include var.media('<laptop') {
      border-top-left-radius: 25px;
      border-top-right-radius: 25px;
      margin-top: 100vw;
      background-color: var.$paleLT;
    }

    @include var.media('>=laptop') {
      display: grid;
      grid-template-columns: calc(100% - (19.48% * 2) - 2rem) 19.48% 19.48%;
      gap: 1rem;
    }

    @include var.media('>=desktop-lg') {
      grid-template-columns: calc(100% - (260px * 2) - 2rem) 260px 260px;
    }

    @include var.media('>=desktop-hg') {
      max-width: 1700px;
    }
  }

  &__main {
    position: relative;
  }

  &__frame {
    position: relative;
    margin-bottom: 25px;
    width: var.$coverWidth;
  }

  &__related {

    @include var.media('<laptop') {
      margin-bottom: 25px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &-title {
      font-weight: 600;
      text-align: center;
      margin-bottom: 0.75rem;
    }
  }

  &__footer {
    margin: var.$mainPadding;
  }
}
</style>
