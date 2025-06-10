<template>
  <div class="category">
    <CategoryHero
      v-if="isFetched && data"
      :data="data"
      :entityKey="pageEntityKey"
      :description="totalCounts"
      @setUploadedImage="setUploadedImage"
    />
    <div class="category__content">
      <EntityCardList
        :entities="albumList"
        :isDraggable="false"
        :isDeletable="false"
        entityKey="albums"
        placeholderPreview="/img/album.webp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CategoryHero } from '~widgets/category-hero'
import { EntityCardList, type UnifiedEntityCard } from '~widgets/entity-cards'
import type { CategoryFull } from '~entities/category'
import type { CollectionFull } from '~entities/collection'

interface Props {
  isFetched: boolean
  totalCounts: string
  pageEntityKey: string
  setUploadedImage: any
  defaultPreview: string
  data: CategoryFull | CollectionFull
}

const props = defineProps<Props>()

const albumList = computed<UnifiedEntityCard[]>(() => {
  const albums = props.data.albums
  const embeddedAlbums = 'embeddedAlbums' in props.data ? props.data.embeddedAlbums : []

  return [...albums, ...embeddedAlbums]
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.category {

  &__content {
    padding: var.$mainPadding;
  }
}
</style>
