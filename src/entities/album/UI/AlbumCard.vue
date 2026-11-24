<template>
  <CardPreview
    :routePath="routePath"
    :cardTitle="card.title"
    :cardCover="cardCover"
    :cardCaption="cardCaption"
    :cardMeta="addedAt"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalization } from '~shared/model'
import { proxyCloudUrl } from '~shared/lib'
import { CardPreview } from '~shared/UI'
import { hostString, assertNever } from '~shared/utils'
import type { ExcludeFromUnifiedEntityCard } from '~widgets/entity-cards'

type Props = {
  card: ExcludeFromUnifiedEntityCard<'CategoryBasic'>
  entityKey: string
  placeholderPreview: string
}

const props = defineProps<Props>()

const { localize } = useLocalization()

const dynamicEntityKey = computed(() => props.entityKey || 'albums')

const routePath = computed(() => {
  const id = props.card._id

  return {
    path: `/${dynamicEntityKey.value}/${id}`
  }
})

const formatAddedAt = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const pad = (part: number) => String(part).padStart(2, '0')

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(date.getHours())}.${pad(date.getMinutes())}`
}

const addedAt = computed(() => {
  if (props.entityKey !== 'albums' || props.card.kind !== 'album' || !props.card.dateCreated) {
    return undefined
  }

  return formatAddedAt(props.card.dateCreated) || undefined
})

const cardCaption = computed(() => {
  switch (props.card.kind) {
    case 'album':
      return `${(props.card.artists ?? []).map((a) => a.title).join('; ') || '—'} / ${props.card.period.title} / ${props.card.genre.title}`
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
      return proxyCloudUrl(props.card.coverURL) || props.placeholderPreview
    case 'compilation':
    case 'collection':
      return props.card.avatar ? hostString(props.card.avatar) : props.placeholderPreview
    default:
      assertNever(props.card)
      return props.placeholderPreview
  }
})
</script>
