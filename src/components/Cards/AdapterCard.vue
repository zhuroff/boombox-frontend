<template>
  <component
    :is="cardComponent"
    :card="card"
    :rootPath="rootPath"
    :placeholderImage="placeholderImage"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import TileCard from './TileCard.vue'
import AlbumCard from './AlbumCard.vue'
import CategoryCard from './CategoryCard.vue'

export default defineComponent({
  name: 'AdapterCard',
  components: {
    TileCard,
    AlbumCard,
    CategoryCard
  },
  props: {
    type: {
      type: String,
      required: true
    },
    card: {
      type: Object as PropType<unknown>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholderImage: {
      type: String,
      required: true
    }
  },
  setup({ type }) {
    return { cardComponent: computed(() => type) }
  }
})
</script>
