<template>
  <div class="collection">
    <CategoryHero
      v-if="isFetched && data"
      :data="data"
      :entityKey="pageEntityKey"
      :description="totalCounts"
      @setUploadedImage="setUploadedImage"
    />
    <div class="collection__content">
      <CollectionDashboard
        :entities="albumList"
        @updatePost="updatePost"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CategoryHero } from '~widgets/category-hero'
import type { CollectionFull, CompilationAlbum } from '~entities/collection'
import CollectionDashboard from './CollectionDashboard.vue'

type Props = {
  isFetched: boolean
  totalCounts: string
  pageEntityKey: string
  setUploadedImage: any
  defaultPreview: string
  data: CollectionFull
}

type Emits = {
  <T>(e: 'saveNewPost', config: { payload: T; path: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const albumList = computed<CompilationAlbum[]>(() => props.data.albums)

const updatePost = (payload: [string, string]) => {
  const [post, albumId] = payload
  emit('saveNewPost', { payload: { albumId, post }, path: 'post' })
}
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.collection {

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
