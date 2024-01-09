<template>
  <component
    :is="cardComponent"
    :card="card"
    :isDraggable="isDraggable"
    :rootPath="card.cardPath"
    :placeholderImage="placeholderImage"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { BasicEntity } from '~/types/Common'
import TileCard from './TileCard.vue'
import AlbumCard from './AlbumCard.vue'
import CategoryCard from './CategoryCard.vue'
import EmbeddedCard from './EmbeddedCard.vue'
import CollectionCard from './CollectionCard.vue'
import CompilationCard from './CompilationCard.vue'
import ListCardBasic from '~/classes/ListCardBasic'

export default defineComponent({
  name: 'AdapterCard',
  components: {
    TileCard,
    AlbumCard,
    CategoryCard,
    EmbeddedCard,
    CollectionCard,
    CompilationCard
  },
  props: {
    card: {
      type: Object as PropType<BasicEntity & ListCardBasic>,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    },
    isDraggable: {
      type: Boolean,
      required: true
    }
  },
  setup({ card }) {
    return { cardComponent: computed(() => card.cardType) }
  }
})
</script>
