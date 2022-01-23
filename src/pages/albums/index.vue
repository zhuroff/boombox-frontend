<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!albums.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <h1 class="section__title">There are {{ totalAlbums }} albums in your collection</h1>
      <transition-group name="flyUp">
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
          v-if="totalPages > 1"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @switchPagination="switchPagination"
        />
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, ref, reactive } from 'vue'
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

    const currentPage = ref(Number(route.query.p) || 1)
    const limit = ref(40)
    const sort = ref({ dateCreated: -1 })
    const totalAlbums = ref(0)
    const totalPages = ref(0)

    if (!route.query.p) {
      router.push({ query: { p: currentPage.value } })
    }
    
    const albums: { isFetched: boolean, data: IAlbumBasic[] } = reactive({
      isFetched: false,
      data: []
    })

    const fetchAlbums = async () => {
      try {
        const payload = {
          page: currentPage.value,
          limit: limit.value,
          sort: sort.value
        }

        const response = await api.post('/api/albums', payload)

        if (response?.status === 200) {
          setAlbum(response.data.docs)
          setPagination(response.data.pagination)
        }
      } catch (error) {
        throw error
      }
    }

    const setAlbum = (data: IAlbumBasic[]) => {
      albums.data = data
      albums.isFetched = true
    }

    const setPagination = (data: IPagination) => {
      totalAlbums.value = data.totalDocs
      totalPages.value = data.totalPages
    }

    fetchAlbums()

    const switchPagination = (value: any) => {
      currentPage.value = value
      albums.isFetched = false
      router.push({ query: { p: currentPage.value } })
      fetchAlbums()
    }

    return {
      albums,
      totalAlbums,
      totalPages,
      currentPage,
      switchPagination
    }
  }
})

</script>
