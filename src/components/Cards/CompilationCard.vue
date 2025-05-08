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
          class="cards__album-cover"
        />
        <img
          src="/img/vinyl.png"
          alt="vinyl placeholder"
          class="cards__album-vinyl"
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
import { Button } from '~shared/UI'
import CompilationItem from '~/classes/CompilationItem'

interface Props {
  card: CompilationItem<BasicEntity>
  rootPath: string
  placeholderImage: string
}

const props = defineProps<Props>()

const {
  globalGetters: { localize, authConfig }
} = useGlobalStore()

const isAdmin = computed(() => (
  authConfig.value.user?.role === 'admin'
))

const cardCaption = computed(() => (
  `${localize('compilations.cardCaption')}: ${props.card.tracks.length}`
))
</script>
