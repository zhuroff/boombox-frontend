<template>
  <section class="template">
    <transition name="fade">
      <Loader
        v-if="!isCompilationReady"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <AlbumContent
        v-if="compilation"
        :relatedAlbums="relatedAlbums"
        entityKey="compilations"
      >
        <template #hero>
          <PageHeadAdapter
            :album="compilation"
            @getRandomAlbum="getRandomAlbum"
          />
        </template>
        <template #content>
          <TrackList
            v-if="'tracks' in compilation"
            :tracks="compilation.tracks"
            :albumID="compilation._id"
            @trackOrderChanged="changeTracksOrder"
            @removeTrackFromCompilation="removeTrackFromCompilation"
          />
        </template>
      </AlbumContent>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useGlobalStore from '~/store/global'
import useGetPage from '~/shared/model/useGetPage'
import useGetList from '~/shared/model/useGetList'
import { Loader } from '~shared/UI'
import AlbumContent from '~/components/Album/AlbumContent.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import DatabaseService from '~/shared/api/DatabaseService'

const { globalGetters: { localize } } = useGlobalStore()

const dbService = new DatabaseService()

const pageEntityKey = ref('compilations')
const preRandomState = ref('')

const { data: compilation, isFetched: isAlbumFetched } = useGetPage<Compilation>(pageEntityKey, dbService, preRandomState)

// setPlayerPlaylist(payload)

const relatedCompilationsReqConfig: RequestConfig = {
  page: 1,
  limit: 5,
  sort: { title: 1 },
  isRandom: 1
}

const isCompilationReady = computed(() => (
  Boolean(compilation.value) && isAlbumFetched.value
))

const getRandomAlbum = () => {
  preRandomState.value = compilation.value?._id || ''
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
          filter: {
            from: 'genres',
            key: 'genre._id',
            name: compilation.value.title,
            value: compilation.value._id,
            excluded: { _id: compilation.value._id }
          }
        }
      }
    : {} as UseEntityListPayload
))

const { data: relatedCompilationsRes } = useGetList<Compilation>(
  relatedCompilationsConfig,
  dbService,
  isCompilationReady
)

const relatedCompilations = computed(() => ([
  {
    docs: relatedCompilationsRes.value?.docs || [],
    name: 'Other'
  }
]).filter(({ docs }) => docs.length))
</script>
