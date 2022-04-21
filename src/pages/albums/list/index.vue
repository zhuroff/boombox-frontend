<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!albums.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition-group name="flyUp">
        <div
          class="section__heading"
          key="heading"
        >
          <h1 class="section__title">
            There are {{ albums.pagination.totalDocs }} albums in your collection
          </h1>
        </div>

        <ul
          v-if="albums.isFetched"
          class="cardlist"
          key="list"
        >
          <CardWrapper
            v-for="album in albums.data"
            :key="album._id"
            :itemKey="album._id"
          >
            <CardAlbum :album="album" />
          </CardWrapper>
        </ul>

        <AppPagination
          v-if="albums.isFetched && albums.pagination.totalPages > 1"
          :pagination="albums.pagination"
          key="pagination"
          @switchPagination="switchPagination"
        />
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AlbumPageResponse, AlbumItemProps } from '~/types/Album'
import { TPagination, RequestConfig } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardAlbum from '~/components/Cards/CardAlbum.vue'
import AppPagination from '~/components/AppPagination.vue'
import AlbumServices from '~/services/AlbumServices'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    CardAlbum,
    AppPagination
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const pageConfig = reactive<RequestConfig>({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 40
    })

    const albums = reactive<AlbumItemProps>({
      isFetched: false,
      data: [],
      pagination: {} as TPagination
    })

    const clearfyAlbumList = () => {
      albums.isFetched = false
      albums.data = []
    }

    const changeRoutePage = (value: number) => {
      router.push({ query: { p: value } })
    }

    const switchPagination = (value: number) => {
      pageConfig.page = value

      clearfyAlbumList()
      changeRoutePage(value)
      fetchAlbums()
    }

    const setFetchedData = (data: AlbumPageResponse) => {
      albums.pagination = data.pagination
      albums.data = data.docs
      albums.isFetched = true
    }

    const fetchAlbums = () => {
      AlbumServices.list(pageConfig)
        .then((data) => setFetchedData(data))
        .catch((ignore) => ignore)
    }

    onMounted(() => {
      if (!route.query.p) {
        changeRoutePage(pageConfig.page)
      }

      fetchAlbums()
    })

    return {
      albums,
      switchPagination
    }
  }
})

</script>
