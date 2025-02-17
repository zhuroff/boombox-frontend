<template>
  <VueDraggableNext
    handle=".--drag"
    tag="ul"
    :class="[`cardlist --${props.template}`]"
    :animation="300"
    :disabled="!isDraggable"
    @end="(event) => $emit('orderChanged', event)"
  >
    <component
      v-for="entity in entities"
      :key="entity._id"
      :is="entityCardComponent"
      :card="entity"
      :isDraggable="isDraggable"
      :isDeletable="isDeletable"
      :entityKey="entityKey"
      :placeholderPreview="placeholderPreview"
      @deleteEntity="(payload: DeletePayload) => $emit('deleteEntity', payload)"
    />
  </VueDraggableNext>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

interface Props<T> {
  entities: T[]
  entityKey: string
  isDraggable?: boolean
  isDeletable?: boolean
  template?: 'col' | 'row'
  placeholderPreview: string
}

const props = withDefaults(defineProps<Props<BasicEntity>>(), {
  template: 'row'
})

const cardsMap: Record<string, string> = {
  albums: 'AlbumCard',
  collections: 'AlbumCard',
  compilations: 'AlbumCard',
  embedded: 'AlbumCard',
  artists: 'CategoryCard',
  periods: 'CategoryCard',
  genres: 'CategoryCard',
}

const entityCardComponent = defineAsyncComponent(() => (
  import(`./Cards/${cardsMap[props.entityKey]}.vue`).then((sfc) => sfc.default)
))
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.cardlist {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  &.--col {
    flex-direction: column;

    .cardlist__item {
      width: 100%;
    }
  }

  &.--row {
    flex-direction: row;
  }

  &__item {
    position: relative;
    border-radius: 5px;
    transition: all 0.3s ease;
    list-style: none;

    &:hover {
      .cardlist__item-action {
        opacity: 1;
        transition: opacity .3s $animation;
      }
    }

    @include media('<tablet') {
      width: calc(50% - 10px);
    }

    @include media('>=tablet', '<desktop') {
      width: calc(33.3333% - 10px);
    }

    @include media('>=desktop', '<desktop-md') {
      width: calc(25% - 10px);
    }

    @include media('>=desktop-md', '<desktop-lg') {
      width: calc(20% - 10px);
    }

    @include media('>=desktop-lg') {
      width: calc(16.6666% - 10px);
    }

    .--drag {
      position: absolute;
      top: 1rem;
      left: 1.25rem;
      z-index: 2000;
      cursor: move;
      opacity: 0;
      background-color: $paleLT;
    }

    &-link {
      display: flex;
      flex-direction: column;
      text-align: center;
      position: relative;
      height: 100%;

      @include media('>=desktop') {
        padding: 0 10px;
      }
    }

    &-image {
      object-fit: cover;
      position: relative;
    }

    &-cover,
    &-vinyl {
      width: 100%;
      aspect-ratio: 1;
      display: block;
      transition: transform 0.5s $animation;
    }

    &-cover {
      position: relative;
      z-index: 2;
      border-radius: 5px;
      object-fit: cover;

      @include media('>=desktop') {
        &:not(.--fixed) {
          &:hover {
            transform: translateX(-10px);
            transition: transform 0.3s $animation;

            & + .cardlist__item-vinyl {
              transform: translateX(20px);
              transition: transform 0.3s $animation;
            }
          }
        }
      }

      &.--rounded {
        border-radius: 50%;
      }

      &.--blind {
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
        }
      }

      iframe {
        border-radius: 5px;
        width: inherit !important;
        height: 100% !important;
        // background-color: $white;
        background-color: $paleLT;
      }
    }

    &-vinyl {
      @include media('<desktop') {
        display: none
      }

      @include media('>=desktop') {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
      }
    }

    &-title {

      @include media('<desktop') {
        display: none
      }

      @include media('>=desktop') {
        @include cardHeading();
      }
    }

    &-info {

      @include media('<desktop') {
        display: none
      }

      @include media('>=desktop') {
        @include cardCaption();
      }
    }

    &-action {
      opacity: 0;
      position: absolute;
      top: 1.25rem;
      right: 2.5rem;
      z-index: 10;
      // background-color: $white;
      background-color: $paleLT;
      transition: opacity .3s $animation;
    }

    &__cover {

      &_label {
        position: relative;
        z-index: 1;

        .icon {
          width: 50px;
          height: 50px;
          color: $white;
        }
      }
    }
  }
}
</style>
