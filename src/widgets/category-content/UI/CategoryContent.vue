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
import { EntityCardList } from '~usecases/cardlist'
import type { Category, Entity } from '~shared/lib'
import type { CollectionBasic } from '~entities/collection'

interface Props {
  isFetched: boolean
  totalCounts: string
  pageEntityKey: string
  setUploadedImage: any
  defaultPreview: string
  data: CategoryBasic | CollectionBasic
}

const props = defineProps<Props>()

const albumList = computed<Entity[]>(() => (
  [...(props.data?.albums || []), ...(props.data?.embeddedAlbums || [])]
))
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.category {

  &__content {
    padding: var.$mainPadding;
  }
}
</style>
