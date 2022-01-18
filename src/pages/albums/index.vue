<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!albums.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition name="flyUp">
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

        <!-- <AppPagination
          v-if="pagination && pagination.totalPages > 1"
          :pagination="pagination"
          @switchPagination="switchPagination"
        /> -->
      </transition>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppPreloader from '~/components/AppPreloader.vue'
import AppCardWrapper from '~/components/AppCardWrapper.vue'
import AppCardAlbum from '~/components/AppCardAlbum.vue'
// import AppPagination from '~/components/AppPagination.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AppPreloader,
    AppCardWrapper,
    AppCardAlbum,
    // AppPagination
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const page = ref(route.query.p || 1)
    const limit = ref(40)
    const sort = reactive({ dateCreated: -1 })
    const pagination = ref(null)

    if (!route.query.p) {
      router.push({ query: { p: page.value } })
    }
    
    const albums = reactive({
      isFetched: false,
      data: []
    })

    const fetchAlbums = async () => {
      try {
        const payload = { page: page.value, limit: limit.value, sort }
        const response = await api.post('/api/albums', payload)

        albums.data = response.data.docs
        albums.isFetched = true
        // pagination.value = response.data.pagination
      } catch (error) {
        // console.error(error)
        throw error
      }
    }

    fetchAlbums()

    const switchPagination = (value: any) => {
      page.value = value
      // albums.value = albumsPlaceholder
      // albums.value = []
      router.push({ query: { p: page.value } })
      fetchAlbums()
    }

    return {
      albums,
      pagination,
      switchPagination
    }
  }
})

</script>
