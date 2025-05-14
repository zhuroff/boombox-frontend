<template>
  <div class="album__hero-cover">
    <CoverArt :cover="album.coverURL || coverPlaceholders('album')"/>
  </div>

  <div class="album__hero-info">
    <slot name="heading"></slot>

    <PageHeadMetadata
      :album="album"
      :length="length"
    />

    <PageHeadActions :actions="actions" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { coverPlaceholders } from '~/utils'
import CoverArt from '~/components/CoverArt.vue'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '../model/types'

interface Props {
  album: Album
  length: string
}

defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const getRandomAlbum = () => emit('getRandomAlbum')
const callSearchBlock = () => emit('callSearchBlock')
const addToCollection = () => emit('addToCollection')
const getWikiInfo = () => emit('getWikiInfo')

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
    icon: 'add-box',
    title: 'heroActions.addToCollection',
    action: addToCollection
  },
  {
    icon: 'target',
    title: 'heroActions.getRandomAlbum',
    action: getRandomAlbum
  }
])
</script>
