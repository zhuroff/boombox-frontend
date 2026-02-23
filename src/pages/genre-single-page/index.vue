<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isFetched"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <CategoryContent
        v-if="isFetched && category"
        :isFetched="isFetched"
        :pageEntityKey="pageEntityKey"
        :data="category"
        :totalCounts="totalCounts"
        :setUploadedImage="setUploadedImage"
        defaultPreview="/img/genre.webp"
      />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CategoryContent } from '~widgets/category-content'
import { useCategory } from '~entities/category'
import type { UploadImageResult } from '~features/uploading'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'

const dbService = new DatabaseService()

const pageEntityKey = ref('genres')

const { localize } = useLocalization()

const {
  category,
  isFetched,
  updateCategoryValue
} = useCategory(pageEntityKey, dbService)

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(category.value?.albums?.length || 0)}`
))

const setUploadedImage = (payload: UploadImageResult) => {
  if (category.value) {
    updateCategoryValue(payload.key, payload.url)
  }
}
</script>
