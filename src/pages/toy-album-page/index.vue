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
            @trackOrderChanged="changeTracksOrder"
          />
        </template>

        <template
          v-if="!isMobile && album.metadataContent"
          #footer
        >
          <DiscogsTable :entity="album.metadataContent" />
        </template>
      </AlbumContent>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTOYAlbum } from '~entities/toy'
import { usePlaylistService } from '~features/player'
import { DiscogsTable } from '~widgets/discogs'
import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { TrackList } from '~widgets/tracklist'
import { DatabaseService } from '~shared/api'
import { useDevice } from '~shared/model'
import { Loader } from '~shared/UI'
import type { ReorderPayload } from '~shared/lib'

const dbService = new DatabaseService()
const route = useRoute()

const { isMobile } = useDevice()

const routeParams = computed(() => route.params)

const {
  album,
  isAlbumReady,
  preRandomState,
  relatedAlbums
} = useTOYAlbum(dbService, routeParams)

const { initPlaylist } = usePlaylistService()

const changeTracksOrder = (payload: ReorderPayload) => {
  console.log(payload)
}

watch(
  [isAlbumReady, album],
  ([isAlbumReady, album]) => {
    isAlbumReady && album && initPlaylist(album)
  }
)
</script>