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
        :setUploadedImage="refetch"
        defaultPreview="/img/album.webp"
      />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CategoryContent } from '~widgets/category-content'
import { useGetPage } from '~shared/model'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'

import type { CollectionFull } from '~entities/collection'

const dbService = new DatabaseService()

const pageEntityKey = ref('collections')

const { localize } = useLocalization()
const { data: collection, isFetched, refetch } = useGetPage<CollectionFull>(pageEntityKey, dbService)

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(collection.value?.albums?.length || 0)}`
))
</script>
