<template>
  <EntityListView
    entityKey="albums"
    placeholderPreview="/img/album.webp"
    pageHeadingKey="headings.albumsPage"
    :additionalRequestConfig="requestConfigPart"
  >
    <template #header>
      <div class="album-list-filters">
        <AlbumNoteFilter
          :noteFilter="noteFilter"
          @update:noteFilter="setNoteFilter"
        />

        <AlbumVinylFilter
          :vinylFilter="vinylFilter"
          @update:vinylFilter="setVinylFilter"
        />

        <AlbumSortFilter
          :albumSort="albumSort"
          @update:albumSort="setAlbumSort"
        />
      </div>
    </template>
  </EntityListView>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { EntityListView } from '~views/entity-list-view'

import {
  AlbumNoteFilter,
  AlbumSortFilter,
  AlbumVinylFilter,
  useAlbumNoteFilter,
  useAlbumSort,
  useAlbumVinylFilter
} from '~entities/album'

const { noteFilter, setNoteFilter, requestConfigPart: noteFilterConfig } = useAlbumNoteFilter()

const { vinylFilter, setVinylFilter, requestConfigPart: vinylFilterConfig } = useAlbumVinylFilter()

const { albumSort, setAlbumSort, requestConfigPart: sortConfig } = useAlbumSort()

const requestConfigPart = computed(() => ({
  ...noteFilterConfig.value,
  ...vinylFilterConfig.value,
  ...sortConfig.value
}))
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.album-list-filters {
  display: flex;
  align-items: center;
  gap: var.$fieldPadding;
  margin-left: auto;
}
</style>
