<template>
  <div class="album__hero-cover">
    <div
      v-html="album.frame"
      class="album__frame"
    />
  </div>

  <div class="album__hero-info">
    <slot name="heading"></slot>
    <PageHeadMetadata :album="album" />
    <PageHeadActions :actions="actions" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '~widgets/page-heads'
import type { EmbeddedFull } from '~/entities/embedded'

interface Props {
  album: EmbeddedFull
}

defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const getRandomAlbum = () => emit('getRandomAlbum')
const callSearchBlock = () => emit('callSearchBlock')
const getWikiInfo = () => emit('getWikiInfo')
const deleteAlbum = () => emit('deleteAlbum')

const actions: ActionPropertyItem[] = reactive([
  {
    icon: 'loupe',
    title: 'heroActions.search',
    action: callSearchBlock
  },
  {
    icon: 'wiki',
    title: 'heroActions.wiki',
    action: getWikiInfo
  },
  {
    icon: 'target',
    title: 'heroActions.getRandomAlbum',
    action: getRandomAlbum
  },
  {
    icon: 'delete',
    title: 'heroActions.deleteAlbum',
    action: deleteAlbum
  }
])
</script>
