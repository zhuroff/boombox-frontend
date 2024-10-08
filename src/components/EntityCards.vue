<template>
  <VueDraggableNext
    handle=".--drag"
    tag="ul"
    class="cardlist"
    :animation="300"
    :disabled="!isDraggable"
    @end="(event) => $emit('orderChanged', event)"
  >
    <component
      v-for="entity in entities"
      :key="entity._id"
      :is="entityCardComponent"
      :card="entity"
      :isDraggable="false"
      :rootPath="entityKey"
      :placeholderPreview="placeholderPreview"
    />
  </VueDraggableNext>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

interface Props<T> {
  entities: T[]
  entityKey: string
  isDraggable?: boolean
  placeholderPreview: string
}

const props = defineProps<Props<BasicEntity>>()

const cardsMap: Record<string, string> = {
  albums: 'AlbumCard',
  artists: 'CategoryCard',
  genres: 'CategoryCard',
  periods: 'CategoryCard',
}

const entityCardComponent = defineAsyncComponent(() => (
  import(`./Cards/${cardsMap[props.entityKey]}.vue`).then((sfc) => sfc.default)
))
</script>
