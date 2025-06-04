<template>
  <li class="cardlist__item">
    <CardPreview
      :routePath="routePath"
      :cardTitle="card.title"
      :cardCover="cardCover"
      :cardCaption="cardCaption"
      :cardFrame="'frame' in card ? card.frame : undefined"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hostString } from '~/utils'
import { CardPreview } from '~shared/UI'
import type { AlbumBasic } from '../lib/types'
import type { EmbeddedBasic } from '~entities/embedded'
import type { CompilationBasic } from '~entities/compilation'
import type { CollectionBasic } from '~entities/collection'
import type { TOYAlbumBasic } from '~entities/toy'

type UnifiedAlbumCard = AlbumBasic | EmbeddedBasic | CompilationBasic | CollectionBasic | TOYAlbumBasic

type Props = {
  card: UnifiedAlbumCard
  entityKey: string
  placeholderPreview: string
}

const props = defineProps<Props>()

const dynamicEntityKey = computed(() => (
  'frame' in props.card ? 'embedded' : props.entityKey || 'albums'
))

const routePath = computed(() => {
  const id = props.card._id || ('path' in props.card ? props.card.path.replace('MelodyMap/TOY/', '') : '')

  return {
    path: `/${dynamicEntityKey.value}/${id}`
  }
})

const cardCaption = computed(() => (
  'artist' in props.card && props.card.artist
    ? `${props.card.artist.title } / ${props.card.period.title} / ${props.card.genre.title}`
    : undefined
))

const cardCover = computed(() => (
  'avatar' in props.card && props.card.avatar
    ? hostString(props.card.avatar)
    : ('coverURL' in props.card && props.card.coverURL) || props.placeholderPreview
))
</script>
