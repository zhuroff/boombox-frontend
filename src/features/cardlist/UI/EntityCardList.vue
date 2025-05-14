<template>
  <VueDraggableNext
    handle=".--drag"
    tag="ul"
    :class="[`cardlist --${template}`]"
    :animation="300"
    :disabled="!isDraggable"
    @end="(event) => emit('orderChanged', event)"
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
      :class="`--${props.template}`"
      @deleteEntity="(payload: DeletePayload) => emit('deleteEntity', payload)"
    />
  </VueDraggableNext>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { AlbumCard } from '~entities/album'
import { CategoryCard } from '~entities/category'

interface Props {
  entities: BasicEntity[]
  entityKey: string
  isDraggable?: boolean
  isDeletable?: boolean
  template?: 'col' | 'row' | 'offset'
  placeholderPreview: string
}

interface Emits {
  (e: 'orderChanged', event: unknown): void
  (e: 'deleteEntity', payload: DeletePayload): void
}

const props = withDefaults(defineProps<Props>(), {
  template: 'row'
})

const emit = defineEmits<Emits>()

const cardsMap: Record<string, any> = {
  albums: AlbumCard,
  collections: AlbumCard,
  compilations: AlbumCard,
  embedded: AlbumCard,
  artists: CategoryCard,
  periods: CategoryCard,
  genres: CategoryCard
}

const entityCardComponent = computed(() => (
  cardsMap[props.entityKey] || null
))
</script>

<style lang="scss">
@use '~/scss/variables' as var;

.cardlist {
  display: flex;
  flex-wrap: wrap;
  gap: var.$basicPadding;

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
        transition: opacity .3s var.$animation;
      }
    }

    @include var.media('<tablet') {
      width: calc(50% - var.$basicPadding);
    }

    @include var.media('>=tablet', '<desktop') {
      width: calc(33.3333% - var.$basicPadding);
    }

    @include var.media('>=desktop', '<desktop-md') {
      &.--row {
        width: calc(25% - var.$basicPadding);
      }

      &.--offset {
        width: calc(33.3333% - var.$basicPadding);
      }
    }

    @include var.media('>=desktop-md', '<=desktop-lg') {
      &.--row {
        width: calc(20% - var.$basicPadding);
      }

      &.--offset {
        width: calc(33.3333% - var.$basicPadding);
      }
    }

    @include var.media('>=desktop-lg') {
      &.--row {
        width: calc(16.6666% - var.$basicPadding);
      }

      &.--offset {
        width: calc(20% - var.$basicPadding);  
      }
    }

    .--drag {
      position: absolute;
      top: 1rem;
      left: 1.25rem;
      z-index: 2000;
      cursor: move;
      opacity: 0;
      background-color: var.$paleLT;
    }

    &-link {
      display: flex;
      flex-direction: column;
      text-align: center;
      position: relative;
      height: 100%;

      @include var.media('>=desktop') {
        padding: 0 var.$basicPadding;
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
      transition: transform 0.5s var.$animation;
    }

    &-cover {
      position: relative;
      z-index: 2;
      border-radius: 5px;
      object-fit: cover;

      @include var.media('>=desktop') {
        &:not(.--fixed) {
          &:hover {
            transform: translateX(-#{var.$basicPadding});
            transition: transform 0.3s var.$animation;

            & + .cardlist__item-vinyl {
              transform: translateX(20px);
              transition: transform 0.3s var.$animation;
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
        background-color: var.$paleLT;
      }
    }

    &-vinyl {
      @include var.media('<desktop') {
        display: none
      }

      @include var.media('>=desktop') {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
      }
    }

    &-title {

      @include var.media('<desktop') {
        display: none
      }

      @include var.media('>=desktop') {
        @include var.cardHeading();
      }
    }

    &-info {

      @include var.media('<desktop') {
        display: none
      }

      @include var.media('>=desktop') {
        @include var.cardCaption();
      }
    }

    &-action {
      opacity: 0;
      position: absolute;
      top: 1.25rem;
      right: 2.5rem;
      z-index: 10;
      background-color: var.$paleLT;
      transition: opacity .3s var.$animation;
    }

    &__cover {

      &_label {
        position: relative;
        z-index: 1;

        .icon {
          width: 50px;
          height: 50px;
          color: var.$white;
        }
      }
    }
  }

  @include var.media('>=laptop') {
    margin-bottom: auto;
  }
}
</style>
