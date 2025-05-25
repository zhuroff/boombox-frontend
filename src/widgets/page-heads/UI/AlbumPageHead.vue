<template>
  <div class="album__hero-cover">
    <CoverArt
      :cover="album.coverURL || coverPlaceholders('album')"
      :entity="albumEntity"
    />
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
import { reactive, computed } from 'vue'
import { coverPlaceholders } from '~/utils'
import { CoverArt } from '~widgets/cover-art'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '~widgets/page-heads'

interface Props {
  album: Album
  length: string
}

const props = defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const getRandomAlbum = () => emit('getRandomAlbum')
const callSearchBlock = () => emit('callSearchBlock')
const addToCollection = () => emit('addToCollection')
const getWikiInfo = () => emit('getWikiInfo')

const albumEntity = computed(() => ({
  cloudURL: props.album.cloudURL,
  path: props.album.path,
  _id: props.album._id,
  title: props.album.title
}))

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
