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
import { useLocalization } from '~shared/lib'
import { CardPreview } from '~shared/UI'
import { hostString, assertNever } from '~/utils'
import type { ExcludeFromUnifiedEntityCard } from '~widgets/entity-cards'

type Props = {
  card: ExcludeFromUnifiedEntityCard<'CategoryBasic'>
  entityKey: string
  placeholderPreview: string
}

const props = defineProps<Props>()

const { localize } = useLocalization()

const dynamicEntityKey = computed(() => (
  'frame' in props.card ? 'embedded' : props.entityKey || 'albums'
))

const routePath = computed(() => {
  const id = props.card._id || ('path' in props.card ? props.card.path.replace('MelodyMap/TOY/', '') : '')

  return {
    path: `/${dynamicEntityKey.value}/${id}`
  }
})

const cardCaption = computed(() => {
  switch (props.card.kind) {
    case 'album':
    case 'embedded':
      return `${props.card.artist.title } / ${props.card.period.title} / ${props.card.genre.title}`
    case 'collection':
    case 'compilation':
      return localize('collections.cardCaption')
    default:
      assertNever(props.card)
      return ''
  }
})

const cardCover = computed(() => {
  switch (props.card.kind) {
    case 'album':
      return props.card.coverURL || props.placeholderPreview
    case 'compilation':
    case 'collection':
      return props.card.avatar ? hostString(props.card.avatar) : props.placeholderPreview
    case 'embedded':
      return props.placeholderPreview
    default:
      assertNever(props.card)
      return props.placeholderPreview
  }
})
</script>
