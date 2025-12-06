<template>
  <div class="album__hero-cover">
    <CoverArt
      entityKey="toy"
      :cover="albumCover"
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
import { reactive, computed } from 'vue'
import { coverPlaceholders } from '~shared/utils'
import { proxyCloudUrl } from '~shared/lib'
import { CoverArt } from '~widgets/cover-art'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '~widgets/page-heads'
import type { TOYAlbumFull } from '~entities/toy'

interface Props {
  album: TOYAlbumFull
  length: string
}

const props = defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const albumCover = computed(() => proxyCloudUrl(props.album.coverURL) || coverPlaceholders('album'))

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
