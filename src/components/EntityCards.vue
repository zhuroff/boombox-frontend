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
      :isDraggable="isDraggable"
      :isDeletable="isDeletable"
      :entityKey="entityKey"
      :placeholderPreview="placeholderPreview"
      @deleteEntity="(payload: DeletePayload) => $emit('deleteEntity', payload)"
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
  isDeletable?: boolean
  placeholderPreview: string
}

const props = defineProps<Props<BasicEntity>>()

const cardsMap: Record<string, string> = {
  albums: 'AlbumCard',
  collections: 'AlbumCard',
  compilations: 'AlbumCard',
  embedded: 'AlbumCard',
  artists: 'CategoryCard',
  periods: 'CategoryCard',
  genres: 'CategoryCard',
}

const entityCardComponent = defineAsyncComponent(() => (
  import(`./Cards/${cardsMap[props.entityKey]}.vue`).then((sfc) => sfc.default)
))
</script>
