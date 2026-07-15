<template>
  <div class="album__hero-cover">
    <CoverArt
      entityKey="albums"
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

    <PageHeadActions :actions="actions">
      <template #append>
        <Button
          className="--vinyl-toggle"
          icon="vinyl"
          :title="localize('heroActions.vinylAvailability')"
          isRounded
          :isInverted="isVinylAvailable"
          @click="toggleVinylAvailability"
        />
      </template>
    </PageHeadActions>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { coverPlaceholders } from '~shared/utils'
import { proxyCloudUrl } from '~shared/lib'
import { Button } from '~shared/UI'
import { useLocalization } from '~shared/model'
import { CoverArt } from '~widgets/cover-art'
import PageHeadMetadata from './PageHeadMetadata.vue'
import PageHeadActions from './PageHeadActions.vue'
import type { ActionPropertyItem, HeadEmits } from '~widgets/page-heads'
import type { AlbumFull } from '~/entities/album'

interface Props {
  album: AlbumFull
  length: string
  isVinylAvailable: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<HeadEmits>()

const { localize } = useLocalization()

const albumCover = computed(() => proxyCloudUrl(props.album.coverURL) || coverPlaceholders('album'))
const getRandomAlbum = () => emit('getRandomAlbum')
const callSearchBlock = () => emit('callSearchBlock')
const addToCollection = () => emit('addToCollection')
const getWikiInfo = () => emit('getWikiInfo')
const toggleVinylAvailability = () => emit('toggleVinylAvailability')

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
