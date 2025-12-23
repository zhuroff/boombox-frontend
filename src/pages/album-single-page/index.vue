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
        :relatedAlbums="!isMobile ? relatedAlbums : []"
        entityKey="albums"
      >
        <template #hero>
          <PageHeadAdapter
            :album="album"
            @getRandomAlbum="() => preRandomState = album?._id || ''"
            @addToCollection="isCollectionsModalEnabled = true"
            @getWikiInfo="isWikiFrameEnabled = true"
          />
        </template>

        <template #content>
          <template v-if="groupedTracks.length === 1 && !groupedTracks[0].release">
            <TrackList
              :tracks="groupedTracks[0].tracks"
              @trackOrderChanged="changePlaylistOrder"
            />
          </template>
          <template v-else>
            <div
              v-for="group in groupedTracks"
              :key="group.release || 'default'"
              class="album__release"
            >
              <h3
                v-if="group.release"
                class="album__release-title"
              >
                {{ group.release }}
              </h3>
              <TrackList
                :tracks="group.tracks"
                @trackOrderChanged="changePlaylistOrder"
              />
            </div>
          </template>
        </template>

        <template #note>
          <div class="album__note">
            <TextEditor
              :content="album?.note || ''"
              :isMobile="false"
              :formatConfig="editorFormatConfig"
              :placeholder="localize('album.notePlaceholder')"
              :defaultExpanded="true"
              :defaultEditMode="true"
              @updateContent="changeAlbumNote"
            />
          </div>
        </template>

        <template v-if="!isMobile" #footer>
          <DiscogsTable :entity="minimumAlbumData" />
        </template>
      </AlbumContent>
    </transition>

    <Modal
      :isModalActive="isCollectionsModalEnabled"
      @closeModal="isCollectionsModalEnabled = false"
    >
      <Gathering
        :entityID="album?._id || ''"
        :isFetching="isGatheringFetching"
        :gatherings="collections"
        inputPlaceholder="collections.namePlaceholder"
        placeholderImage="/img/album.webp"
        @onSelectGathering="selectCollection"
        @onCreateGathering="createCollection"
      />
    </Modal>
    <Modal
      :isModalActive="isWikiFrameEnabled"
      @closeModal="isWikiFrameEnabled = false"
    >
      <WikiFrame :entity="minimumAlbumData" />
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { AlbumContent } from '~widgets/album-content'
import { PageHeadAdapter } from '~widgets/page-heads'
import { DiscogsTable } from '~widgets/discogs'
import { Gathering } from '~widgets/gathering'
import { TrackList } from '~widgets/tracklist'

import { useCollections } from '~features/collection'
import { usePlaylistService } from '~features/player'
import { WikiFrame } from '~features/wiki'

import { useAlbum } from '~entities/album'
import type { TrackBasic } from '~entities/track'

import { Modal, Loader } from '~shared/UI'
import { TextEditor, TextEditorFormatting, type TextEditorFormatConfig } from '~widgets/text-editor'
import { DatabaseService } from '~shared/api'
import { useDevice, useLocalization } from '~shared/model'
import { debounce } from '~shared/utils'

const dbService = new DatabaseService()

const { isMobile } = useDevice()
const { localize } = useLocalization()
const { initPlaylist, changePlaylistOrder } = usePlaylistService()

const {
  album,
  isAlbumReady,
  preRandomState,
  updateAlbumNote,
  relatedAlbums
} = useAlbum(dbService)

const {
  collections,
  selectCollection,
  createCollection,
  isGatheringFetching,
  isCollectionsModalEnabled
} = useCollections(album, dbService)

const isWikiFrameEnabled = ref(false)

const editorFormatConfig: TextEditorFormatConfig = new Set([
  TextEditorFormatting.BOLD,
  TextEditorFormatting.ITALIC,
  TextEditorFormatting.BLOCKQUOTE,
  TextEditorFormatting.LINK,
])

const minimumAlbumData = computed(() => ({
  albumTitle: album.value?.title || '',
  albumArtist: album.value?.artist?.title || ''
}))

type TrackGroup = {
  release: string | null
  tracks: TrackBasic[]
}

const groupedTracks = computed<TrackGroup[]>(() => {
  if (!album.value?.tracks) return []
  
  const tracks = album.value.tracks
  
  // Проверяем, есть ли треки с release
  const hasReleases = tracks.some(track => track.release)
  
  if (!hasReleases) {
    // Если нет релизов - возвращаем все треки как одну группу
    return [{ release: null, tracks }]
  }
  
  // Группируем треки по релизам
  const groupsMap = new Map<string | null, typeof tracks>()
  
  tracks.forEach(track => {
    const release = track.release || null
    if (!groupsMap.has(release)) {
      groupsMap.set(release, [])
    }
    const groupTracks = groupsMap.get(release)
    if (groupTracks) {
      groupTracks.push(track)
    }
  })
  
  // Преобразуем Map в массив объектов
  return Array.from(groupsMap.entries()).map(([release, tracks]) => ({
    release,
    tracks
  }))
})

const changeAlbumNote = debounce((value: string) => {
  album.value?._id && updateAlbumNote([album.value._id, value])
}, 1000)

watch(
  [isAlbumReady, album],
  ([isAlbumReady, album]) => {
    isAlbumReady && album && initPlaylist(album)
  }
)
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.album__release {
  margin-top: var.$mainPadding;
  
  &:first-of-type {
    @include var.media('>=desktop') {
      margin-top: 5rem;
    }
  }

  &-title {
    @include var.serif(1.25rem);
    margin-bottom: var.$fieldPadding;
    text-align: center;
    color: var.$black;
  }

  .tracklist {
    margin-top: 0;
  }
}
</style>
