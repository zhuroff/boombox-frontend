<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!albums.isFetched"
        mode="light"
      />
    </transition>

    <transition-group name="flyUp">
      <div
        class="section__heading"
        key="heading"
      >
        <h1 class="section__title">
          There are {{ albums.pagination.totalDocs }} albums in your collection
        </h1>

        <Dropdown
          :options="sortOptions"
          @chooseItem="setSorting"
        />
      </div>

      <ul
        v-if="albums.isFetched"
        class="cardlist"
        key="list"
      >
        <CardWrapper
          v-for="album in albums.data"
          :key="album._id"
        >
          <CardAlbum :album="album" />
        </CardWrapper>
      </ul>

      <Pagination
        v-if="albums.isFetched && albums.pagination.totalPages > 1"
        :pagination="albums.pagination"
        key="pagination"
        @switchPagination="switchPagination"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">

import { defineComponent, reactive, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AlbumPageResponse, AlbumItemProps } from '~/types/Album'
import { TPagination, RequestConfig, DropdownOption, SortingValue } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Dropdown from '~/components/Dropdown/Dropdown.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardAlbum from '~/components/Cards/CardAlbum.vue'
import Pagination from '~/components/Pagination/Pagination.vue'
import AlbumServices from '~/services/AlbumServices'

export default defineComponent({
  components: {
    AppPreloader,
    Dropdown,
    CardWrapper,
    CardAlbum,
    Pagination
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

    let sortOptions = ref<DropdownOption<SortingValue>[]>([
      {
        title: 'Title ASC',
        value: { title: 1 },
        isActive: true
      },

      {
        title: 'Title DESC',
        value: { title: -1 },
        isActive: false
      },

      {
        title: 'Created ASC',
        value: { dateCreated: 1 },
        isActive: false
      },

      {
        title: 'Created DESC',
        value: { dateCreated: -1 },
        isActive: false
      }
    ])

    const setSorting = (value: SortingValue) => {
      sortOptions.value = sortOptions.value.map((option) => (
        { ...option, isActive: JSON.stringify(option.value) === JSON.stringify(value) }
      ))

      pageConfig.sort = value
      
      clearfyAlbumList()
      fetchAlbums()
    }

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
      sortOptions,
      setSorting,
      switchPagination
    }
  }
})

</script>
