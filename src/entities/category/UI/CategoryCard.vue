<template>
  <li class="cardlist__item">
    <CardPreview
      :routePath="routePath"
      :cardCover="cardCover"
      :cardTitle="card.title"
      :withVinyl="false"
      :cardCaption="cardCaption"
      :coverClasses="['--fixed', '--rounded']"
    />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { hostString } from '~/utils'
import { useTranslate } from '~features/localization'
import { CardPreview } from '~shared/UI'

interface Props {
  card: any /* CategoryItem */
  placeholderPreview: string
  entityKey: string
}

const props = defineProps<Props>()

const { localize } = useTranslate()
const host = (pathname: string) => hostString(pathname)

const routePath = computed(() => ({
  path: `/${props.entityKey}/${props.card._id}`
}))

const cardCover = computed(() => (
  props.card.avatar ? host(props.card.avatar) : props.placeholderPreview
))

const cardCaption = computed(() => (
  `${localize('navigation.albums')}: ${props.card.albums}`
))
</script>
