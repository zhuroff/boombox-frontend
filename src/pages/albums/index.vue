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
        <h1 class="section__title">
          There are {{ albums.pagination.totalDocs }} albums in your collection
        </h1>

        <ul
          v-if="albums.isFetched"
          class="cardlist"
        >
          <AppCardWrapper
            v-for="(album, index) in albums.data"
            :key="index"
          >
            <AppCardAlbum :album="album" />
          </AppCardWrapper>
        </ul>

        <AppPagination
          v-if="albums.isFetched && albums.pagination.totalPages > 1"
          :pagination="albums.pagination"
          @switchPagination="switchPagination"
        />
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IAlbumBasic } from '~/types/Album'
import { IPagination } from '~/types/Global'
import AppPreloader from '~/components/AppPreloader.vue'
import AppCardWrapper from '~/components/AppCardWrapper.vue'
import AppCardAlbum from '~/components/AppCardAlbum.vue'
import AppPagination from '~/components/AppPagination.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AppPreloader,
    AppCardWrapper,
    AppCardAlbum,
    AppPagination
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const pageConfig = reactive({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 40
    })

    const albums = reactive({
      isFetched: false,
      data: [] as IAlbumBasic[],
      pagination: {} as IPagination
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

    const setFetchedData = (data: { docs: IAlbumBasic[], pagination: IPagination }) => {
      albums.isFetched = true

      if (data) {
        albums.pagination = data.pagination
        albums.data = data.docs
      }
    }

    const fetchAlbums = async () => {
      try {
        const response = await api.post('/api/albums', pageConfig)

        if (response?.status === 200) {
          setFetchedData(response.data)
        }
      } catch (error) {
        throw error
      }
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
