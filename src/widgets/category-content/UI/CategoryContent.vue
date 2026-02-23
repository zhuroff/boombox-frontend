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
        :entities="data.albums"
        :isDraggable="false"
        :isDeletable="false"
        entityKey="albums"
        placeholderPreview="/img/album.webp"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CategoryHero } from '~widgets/category-hero'
import { EntityCardList } from '~widgets/entity-cards'
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

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.category {

  &__content {

    @include var.media('<desktop') {
      padding: var.$minPadding var.$minPadding var.$mainPadding;
    }

    @include var.media('>=desktop') {
      padding: var.$mainPadding;
    }
  }
}
</style>
