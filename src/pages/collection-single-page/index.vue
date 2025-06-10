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
        v-if="isFetched && collection"
        :isFetched="isFetched"
        :pageEntityKey="pageEntityKey"
        :data="collection"
        :totalCounts="totalCounts"
        :setUploadedImage="setUploadedImage"
        defaultPreview="/img/album.webp"
      />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CategoryContent } from '~widgets/category-content'
import { useCollection } from '~entities/collection'
import type { UploadImageResult } from '~usecases/uploading'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'

import { useTranslate } from '~usecases/localization'

const dbService = new DatabaseService()

const pageEntityKey = ref('collections')

const { localize } = useTranslate()

const {
  collection,
  isFetched,
  updateCollectionValue
} = useCollection(dbService)

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(collection.value?.albums?.length || 0)}`
))

const setUploadedImage = (payload: UploadImageResult) => {
  if (collection.value) {
    updateCollectionValue(payload.key, payload.url)
  }
}
</script>
