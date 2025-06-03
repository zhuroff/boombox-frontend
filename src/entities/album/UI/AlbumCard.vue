<template>
  <li class="cardlist__item">
    <CardPreview
      :routePath="routePath"
      :cardTitle="card.title"
      :cardCover="cardCover"
      :cardCaption="cardCaption"
    />
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
      isInverted
      isRounded
      className="cardlist__item-action"
      @click="() => $emit('deleteEntity', { id: card._id, dynamicEntityKey })"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hostString } from '~/utils'
import { Button, CardPreview } from '~shared/UI'
import { useUser } from '~entities/user'
import type { UnifiedAlbum } from '~shared/lib'

interface Props {
  card: UnifiedAlbum
  entityKey: string
  isDraggable?: boolean
  isDeletable?: boolean
  placeholderPreview: string
}

const props = defineProps<Props>()

const { isAdmin } = useUser()

const dynamicEntityKey = computed(() => (
  'frame' in props.card ? 'embedded' : props.entityKey || 'albums'
))

const routePath = computed(() => {
  const id = props.card._id || ('path' in props.card ? props.card.path.replace('MelodyMap/TOY/', '') : '')

  return {
    path: `/${dynamicEntityKey.value}/${id}`
  }
})

const cardCaption = computed(() => (
  'artist' in props.card && props.card.artist
    ? `${props.card.artist.title } / ${props.card.period.title} / ${props.card.genre.title}`
    : undefined
))

const cardCover = computed(() => (
  'avatar' in props.card && props.card.avatar
    ? hostString(props.card.avatar)
    : ('coverURL' in props.card && props.card.coverURL) || props.placeholderPreview
))
</script>
