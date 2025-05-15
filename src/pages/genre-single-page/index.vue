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
import { CategoryContent, useCategory } from '~features/category'
import type { UploadImageResult } from '~entities/upload/model/types'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'

import useGlobalStore from '~/store/global'

const dbService = new DatabaseService()

const pageEntityKey = ref('genres')

const { globalGetters: { localize } } = useGlobalStore()

const {
  category,
  isFetched,
  updateCategoryValue
} = useCategory(pageEntityKey, dbService)

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(category.value?.albums?.length || 0) + (category.value?.embeddedAlbums?.length || 0)}`
))

const setUploadedImage = (payload: UploadImageResult) => {
  if (category.value) {
    updateCategoryValue(payload.key, payload.url)
  }
}
</script>
