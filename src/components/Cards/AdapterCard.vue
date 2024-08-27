<template>
  <component
    :is="cardComponent"
    :card="card"
    :isDraggable="isDraggable"
    :rootPath="card.cardPath"
    :placeholderImage="placeholderImage"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BasicEntity } from '~/types/Common'
import ListCardBasic from '~/classes/ListCardBasic'
import AlbumCard from './AlbumCard.vue'
import CategoryCard from './CategoryCard.vue'
import EmbeddedCard from './EmbeddedCard.vue'
import CollectionCard from './CollectionCard.vue'
import CompilationCard from './CompilationCard.vue'

interface Props {
  card: BasicEntity & ListCardBasic
  placeholderImage: string
  isDraggable: boolean
}

const props = defineProps<Props>()

const cardComponent = computed(() => props.card.cardType)
</script>
