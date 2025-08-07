<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isAlbumReady"
        mode="light"
      />
    </transition>

    <transition name="fade">
      <AlbumContent
        v-if="album"
        :relatedAlbums="relatedAlbums"
        entityKey="toy"
      >
        <template #hero>
          <PageHeadAdapter
            :album="album"
            @getRandomAlbum="() => {
              preRandomState = album?.period.title || ''
            }"
          />
        </template>

        <template #content>
          <TrackList
            :tracks="album.tracks"
            isTOYTracks
          />
        </template>

        <template
          v-if="album.metadataContent"
          #footer
        >
          <DiscogsTable :entity="album.metadataContent" />
        </template>
      </AlbumContent>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTOYAlbum } from '~entities/toy'
import { DiscogsTable } from '~widgets/discogs'
import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { TrackList } from '~widgets/tracklist'
import { DatabaseService } from '~shared/api'
import { Loader } from '~shared/UI'

const dbService = new DatabaseService()
const route = useRoute()

const routeParams = computed(() => route.params)

const {
  album,
  isAlbumReady,
  preRandomState,
  relatedAlbums
} = useTOYAlbum(dbService, routeParams)
</script>