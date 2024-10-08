<template>
  <li class="cardlist__item">
    <router-link
      class="cardlist__item-link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <div class="cardlist__item-image">
        <img
          :src="card.coverURL || placeholderPreview"
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
      <div class="cardlist__item-info">
        {{ cardCaption }}
      </div>
    </router-link>
    <Button
      v-if="isAdmin && isDraggable"
      icon="drag"
      size="small"
      isInverted
      isRounded
      className="--drag"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'
import Button from '~/components/Button.vue'

interface Props {
  card: AlbumItem
  rootPath: string
  isDraggable: boolean
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
  `${props.card.artist.title } / ${props.card.period.title} / ${props.card.genre.title}`
))
</script>
