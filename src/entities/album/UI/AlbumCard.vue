<template>
  <li class="cardlist__item">
    <router-link
      class="cardlist__item-link"
      :to="routePath"
    >
      <div class="cardlist__item-image">
        <div
          v-if="'frame' in card && card.frame"
          v-html="card.frame"
          class="cardlist__item-cover --blind"
        />
        <img
          v-else
          :src="cardCover"
          :alt="card.title"
          referrerpolicy="no-referrer"
          class="cardlist__item-cover"
        />
        <img
          src="/img/vinyl.png"
          alt="vinyl placeholder"
          class="cardlist__item-vinyl"
        />
      </div>
      <div class="cardlist__item-title">
        {{ card.title }}
      </div>
      <div
        v-if="cardCaption"
        class="cardlist__item-info"
      >
        {{ cardCaption }}
      </div>
    </router-link>
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
import { Button } from '~shared/UI'
import { useUser } from '~entities/user'

interface Props {
  card: AlbumItem | CollectedItem | EmbeddedItem
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
  const id = props.card._id || 'path' in props.card && props.card.path.replace('MelodyMap/TOY/', '')

  return {
    path: `/${dynamicEntityKey.value}/${id}`
  }
})

const cardCaption = computed(() => (
  'artist' in props.card && props.card.artist
    ? `${props.card.artist.title } / ${props.card.period.title} / ${props.card.genre.title}`
    : null
))

const cardCover = computed(() => (
  'avatar' in props.card && props.card.avatar
    ? hostString(props.card.avatar)
    : ('coverURL' in props.card && props.card.coverURL) || props.placeholderPreview
))
</script>
