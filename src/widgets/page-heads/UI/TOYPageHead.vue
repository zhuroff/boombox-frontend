<template>
  <div class="album__hero-cover">
    <CoverArt
      entityKey="toy"
      :cover="album.coverURL || coverPlaceholders('album')"
      :entity="album"
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
import { reactive } from 'vue'
import { coverPlaceholders } from '~/utils'
import { CoverArt } from '~widgets/cover-art'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '~widgets/page-heads'
import type { TOYAlbumFull } from '~entities/toy'

interface Props {
  album: TOYAlbumFull
  length: string
}

defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const getRandomAlbum = () => emit('getRandomAlbum')
const callSearchBlock = () => emit('callSearchBlock')

const actions: ActionPropertyItem[] = reactive([
  {
    icon: 'loupe',
    title: 'heroActions.search',
    action: callSearchBlock
  },
  {
    icon: 'target',
    title: 'heroActions.getRandomAlbum',
    action: getRandomAlbum
  }
])
</script>
