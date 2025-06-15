<template>
  <div class="album__hero-cover">
    <CoverArt
      entityKey="compilations"
      uploadSlug="compilations"
      uploadable
      :cover="album.avatar ? hostString(album.avatar) : coverPlaceholders('album')"
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
import { hostString, coverPlaceholders } from '~shared/utils'
import { CoverArt } from '~widgets/cover-art'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '~widgets/page-heads'
import type { CompilationFull } from '~entities/compilation'

interface Props {
  album: CompilationFull
  length: string
}

defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const getRandomAlbum = () => emit('getRandomAlbum')
const callSearchBlock = () => emit('callSearchBlock')
const deleteAlbum = () => emit('deleteAlbum')

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
  },
  {
    icon: 'delete',
    title: 'heroActions.deleteAlbum',
    action: deleteAlbum
  }
])
</script>
