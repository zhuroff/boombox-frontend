<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isCompilationReady"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <div v-if="compilation" class="album">
        <PageHeadAdapter
          :album="compilation"
          @getRandomAlbum="getRandomAlbum"
        />
        <div class="album__content">
          <div
            class="album__main"
            ref="albumContent"
          >
            <TrackList
              v-if="'tracks' in compilation"
              :tracks="compilation.tracks"
              :albumID="compilation._id"
              @trackOrderChanged="changeTracksOrder"
              @removeTrackFromCompilation="removeTrackFromCompilation"
            />
          </div>
          <div
            v-for="{ name, docs } in relatedCompilations"
            class="album__related"
          >
            <div class="album__related-title">
              {{ localize('moreOf') }} {{ name }}
            </div>
            <EntityCards
              :entities="docs"
              :entityKey="'albums'"
              :isDraggable="false"
              :isDeletable="false"
              template="col"
              placeholderPreview="/img/album.webp"
              @deleteEntity="confirmDelete"
            />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'
import useEntityPage from '~/shared/useEntityPage'
import useEntityList from '~/shared/useEntityList'
import Preloader from '~/components/Preloader.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import EntityCards from '~/components/EntityCards.vue'

const { globalGetters: { localize, isAdmin } } = useGlobalStore()

const { data: compilation, isFetched: isAlbumFetched } = useEntityPage<Compilation>('compilations')

// setPlayerPlaylist(payload)

const relatedCompilationsReqConfig: RequestConfig = {
  page: 1,
  limit: 5,
  sort: { title: 1 },
  isRandom: true
}

const isCompilationReady = computed(() => (
  Boolean(compilation.value) && isAlbumFetched.value
))

const getRandomAlbum = (entityType: string) => {
  console.log('GET RANDOM', entityType)
}

const changeTracksOrder = (payload: ReorderPayload) => {
  // emit('trackOrderChanged', payload)
}

const removeTrackFromCompilation = (payload: GatheringUpdateReq) => {
  // emit('removeTrackFromCompilation', payload)
}

const confirmDelete = () => {

}

const relatedCompilationsConfig = computed<UseEntityListPayload>(() => (
  compilation.value
    ? {
        qEntity: 'relatedCompilations',
        entityKey: 'compilations',
        requestConfig: {
          ...relatedCompilationsReqConfig,
          // filter: {
          //   from: 'genres',
          //   key: 'genre._id',
          //   name: compilation.value.genre.title,
          //   value: compilation.value.genre._id,
          //   excluded: { _id: compilation.value._id, 'artist._id': compilation.value.artist._id }
          // }
        }
      }
    : {} as UseEntityListPayload
))

const { data: relatedCompilationsRes } = useEntityList<Compilation>(relatedCompilationsConfig, isCompilationReady)

const relatedCompilations = computed(() => ([
  {
    docs: relatedCompilationsRes.value?.docs || [],
    name: 'Other'
  }
]).filter(({ docs }) => docs.length))
</script>
