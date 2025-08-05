<template>
  <li class="cardlist__item">
    <component :is="entityCardComponent" />

    <Button
      v-if="isAdmin && isDraggable"
      icon="drag"
      size="small"
      isInverted
      isRounded
      className="cardlist__item-action --drag"
    />

    <Button
      v-if="isAdmin && isDeletable"
      icon="delete"
      size="small"
      isRounded
      isBorderless
      className="cardlist__item-action"
      @click="isAdmin && isDeletable ? deleteEntity() : null"
    />
  </li>
</template>

<script setup lang="ts">
import { h, computed, type Component } from 'vue'

import { AlbumCard } from '~entities/album'
import { CategoryCard } from '~entities/category'

import { Button } from '~shared/UI'
import { useUser } from '~shared/model'
import type { DeletePayload } from '~shared/lib'

import type { UnifiedEntityCard } from '../lib/types'

type Props = {
  card: UnifiedEntityCard
  entityKey: string
  isDraggable?: boolean
  isDeletable?: boolean
  placeholderPreview: string
}

type Emits = {
  (e: 'deleteEntity', payload: DeletePayload): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cardsMap: Record<string, Component> = {
  albums: AlbumCard,
  collections: AlbumCard,
  compilations: AlbumCard,
  toy: AlbumCard,
  embedded: AlbumCard,
  artists: CategoryCard,
  periods: CategoryCard,
  genres: CategoryCard
}

const entityCardComponent = computed(() => (
  h(
    cardsMap[props.entityKey],
    {
      card: props.card,
      entityKey: props.entityKey,
      placeholderPreview: props.placeholderPreview,
      cardFrame: 'frame' in props.card ? props.card.frame : undefined
    }
  )
))

const { isAdmin } = useUser()

const deleteEntity = () => {
  emit('deleteEntity', {
    id: props.card._id,
    entityKey: props.entityKey
  })
}
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.cardlist__item {
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

  &-action {
    opacity: 0;
    position: absolute;
    top: 1.25rem;
    right: 2.5rem;
    z-index: 10;
    background-color: var.$paleLT;
    transition: opacity .3s var.$animation;
  }
}
</style>
