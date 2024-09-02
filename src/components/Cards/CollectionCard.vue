<template>
  <li class="cards__album">
    <router-link
      class="cards__album-link"
      :to="{ path: `/${rootPath}/${card._id}` }"
    >
      <div class="cards__album-image">
        <img
          :src="card.avatar || placeholderImage"
          :alt="card.title"
          class="cards__album-cover --fixed"
        />
      </div>
      <div class="cards__album-title">{{ card.title }}</div>
      <div class="cards__album-info">{{ cardCaption }}</div>
    </router-link>
    <Button
      v-if="isAdmin"
      icon="delete"
      size="small"
      className="--delete"
      isInverted
      isRounded
      @click="() => $emit('deleteEntity', card._id)"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasicEntity } from '~/types/Common'
import useGlobalStore from '~/store/global'
import CollectionEntity from '~/classes/CollectionEntity'
import Button from '~/components/Button.vue'

interface Props {
  card: CollectionEntity<BasicEntity>
  rootPath: string
  placeholderImage: string
}

const props = defineProps<Props>()

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const cardCaption = computed(() => (
  `${localize('collections.cardCaption')}: ${props.card.albums.length}`
))

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))
</script>

<style lang="scss" scoped>
.cards {

  &__album {

    .--delete {
      left: 1.75rem;
    }
  }
}
</style>
