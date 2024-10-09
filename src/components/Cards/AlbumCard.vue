<template>
  <li class="cardlist__item">
    <router-link
      class="cardlist__item-link"
      :to="{ path: `/${entityKey}/${card._id}` }"
    >
      <div class="cardlist__item-image">
        <img
          :src="cardCover"
          :alt="card.title"
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
      @click="() => $emit('deleteEntity', { id: card._id, entityKey })"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hostString } from '~/utils'
import useGlobalStore from '~/store/global'
import Button from '~/components/Button.vue'

interface Props {
  card: AlbumItem | CollectedItem
  entityKey: string
  isDraggable?: boolean
  isDeletable?: boolean
  placeholderPreview: string
}

const props = defineProps<Props>()

const {
  globalGetters: { authConfig }
} = useGlobalStore()

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

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
