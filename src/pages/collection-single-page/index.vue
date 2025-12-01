<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isFetched"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <CollectionContent
        v-if="isFetched && collection"
        :isFetched="isFetched"
        :pageEntityKey="pageEntityKey"
        :data="collection"
        :totalCounts="totalCounts"
        :setUploadedImage="refetch"
        defaultPreview="/img/album.webp"
        @saveNewPost="saveNewPost"
      />
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CollectionContent } from '~widgets/collection-content'
import { useGetPage, useUpdateEntity } from '~shared/model'

import { Loader } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { useLocalization } from '~shared/model'

import type { CollectionFull } from '~entities/collection'

const dbService = new DatabaseService()

const pageEntityKey = ref('collections')

const { localize } = useLocalization()
const { data: collection, isFetched, refetch } = useGetPage<CollectionFull>(pageEntityKey, dbService)

const collectionId = computed(() => collection.value?._id || null)

const { updateEntry } = useUpdateEntity(pageEntityKey, dbService, collectionId)

const saveNewPost = (config: { payload: { albumId: string; post: string }, path: 'post' }) => {
  updateEntry(config).catch(console.error)
}

const totalCounts = computed(() => (
  localize('totalAlbums') + `: ${(collection.value?.albums?.length || 0)}`
))
</script>
