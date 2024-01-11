<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="compilation"
    :relatedAlbums="relatedCompilations"
  >
    <template #hero>
      <AlbumHero
        v-if="compilation._id"
        :id="compilation._id"
        :title="compilation.title"
        :totalCounts="totalCounts"
        @getRandomAlbum="getRandom"
      >
        <template #cover>
          <CoverArt :cover="compilation.avatar" />
        </template>
        <template #navlist>
          <li
            class="overlay__list-item"
            @click="isDelConfirm = true"
          >{{ lang('deleteEntity') }}</li>
        </template>
      </AlbumHero>
    </template>
    <template #modal>
      <Modal
        v-if="isDelConfirm"
        :isModalActive="isDelConfirm"
        @closeModal="delReject"
      >
        <Confirmation
          :message="lang('delConfirmMessage')"
          @confirm="deleteCompilation"
          @reject="delReject"
        />
      </Modal>
    </template>
  </AlbumPageTemplate>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue'
import { BasicEntity, RandomEntityReqFilter } from '~/types/Common'
import { CompilationEntityRes, TrackRes } from '~/types/ReqRes'
import { RelatedCompilations } from '~/types/Album'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useLocales } from '~/hooks/useLocales'
import { conjugate } from '~/utils'
import store from '~/store'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import CoverArt from '~/components/CoverArt.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import CompilationItem from '~/classes/CompilationItem'
import CompilationPage from '~/classes/CompilationPage'
import Confirmation from '~/components/Confirmation.vue'
import Modal from '~/components/Modal.vue'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate,
    Confirmation,
    AlbumHero,
    CoverArt,
    Modal
  },
  setup() {
    const {
      fetchData,
      deleteEntry,
      isDataFetched,
      getRandomAlbum,
      getRelatedAlbums,
      route
    } = useSinglePage<
      CompilationEntityRes<TrackRes>,
      CompilationPage<TrackRes>,
      CompilationEntityRes<BasicEntity>
    >(CompilationPage, 'CompilationCard', 'compilations')

    const { lang } = useLocales()
    const { actions } = store
    const compilation = ref<CompilationPage<TrackRes>>({} as CompilationPage<TrackRes>)
    const relatedCompilations = ref<RelatedCompilations[]>([])
    const entityType = ref('compilations')
    const isDelConfirm = ref(false)

    const getRandom = () => {
      getRandomAlbum(entityType.value)
    }

    const getRelated = async () => {
      const relatedAlbumsConfig: RandomEntityReqFilter[] = [
        {
          from: 'compilations',
          key: 'compilation._id',
          name: lang('compilations.more'),
          excluded: { _id: compilation.value._id }
        }
      ]

      try {
        relatedCompilations.value = []
        const response = await Promise.all(relatedAlbumsConfig.map(async (config) => (
          await getRelatedAlbums(config, entityType.value)
        )))
        
        relatedCompilations.value = response.map(({ docs, name }) => ({
          name,
          docs: docs.map<CompilationItem<BasicEntity>>((compilation) => (
            new CompilationItem(compilation, 'CompilationCard', 'compilations')
          ))
        }))
      } catch (error) {
        console.error(error)
      }
    }

    const calcTotalTracksTime = (tracks: CompilationPage<TrackRes>['tracks']): string => {
      const totalDurationInSeconds = tracks.reduce((acc, next) => (
        acc + (Number(next.duration) || 0)
      ), 0)

      const hours = Math.floor(totalDurationInSeconds / 3600)
      const minutes = Math.floor((totalDurationInSeconds % 3600) / 60)
      const seconds = Math.floor(totalDurationInSeconds % 60)

      const formattedTime = `
        ${hours.toString().padStart(2, '0')}:
        ${minutes.toString().padStart(2, '0')}:
        ${seconds.toString().padStart(2, '0')}
      `.replace(/\s+/g, '')

      return formattedTime
    }

    const delReject = () => {
      isDelConfirm.value = false
    }

    const deleteCompilation = () => {
      deleteEntry('compilations', compilation.value._id)
    }

    const totalCounts = computed(() => {
      const isAllTracksHaveDuration = compilation.value.tracks?.every((track) => (
        Number(track.duration)
      ))
      
      return `
        ${compilation.value.tracks?.length} ${conjugate('tracks', compilation.value.tracks?.length)}:
        ${isAllTracksHaveDuration ? calcTotalTracksTime(compilation.value.tracks) : lang('unknownTime')}.
        ${lang('listenedTracks')} ${compilation.value.tracks?.reduce((acc, { listened }) => (
          acc + (Number(listened) || 0)
        ), 0)}
      `.trim()
    })

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== compilation.value._id) {
          compilation.value = {} as CompilationPage<TrackRes>
          fetchData(entityType.value)
            .then((payload) => {
              if (payload) {
                compilation.value = payload
                actions.setPlayerPlaylist(payload)
                getRelated()
              }
            })
        }
      },
      { immediate: false }
    )

    onMounted(() => {
      fetchData(entityType.value)
        .then((payload) => {
          if (payload) {
            compilation.value = payload
            actions.setPlayerPlaylist(payload)
            getRelated()
          }
        })
    })

    return {
      lang,
      delReject,
      compilation,
      entityType,
      getRelated,
      isDelConfirm,
      totalCounts,
      isDataFetched,
      deleteCompilation,
      relatedCompilations,
      getRandom
    }
  }
})
</script>
~/classes/CompilationItem