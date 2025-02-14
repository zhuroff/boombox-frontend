<template>
  <section class="template">
    <transition name="fade">
      <Preloader
        v-if="!isCompilationReady"
        mode="light"
      />
    </transition>
    <transition name="fade">
      <AlbumPageTemplate
        v-if="compilation"
        :album="compilation"
        :relatedAlbums="relatedCompilations"
      >
        <template #head>
          <PageHeadAdapter
            :album="compilation"
            @getRandomAlbum="getRandom"
          />
        </template>
      </AlbumPageTemplate>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useEntityPage from '~/shared/useEntityPage'
import useEntityList from '~/shared/useEntityList'
import Preloader from '~/components/Preloader.vue'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import PageHeadAdapter from '~/components/PageHeadAdapter/PageHeadAdapter.vue'

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

const getRandom = () => {
  console.log('GET RANDOM')
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
]))
</script>
