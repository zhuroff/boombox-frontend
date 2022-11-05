<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!toyGenres.isFetched" mode="light" />
    </transition>

    <transition-group name="flyUp">
      <div class="section__heading" key="heading">
        <h1 class="section__title">
          Tracks of the Years
        </h1>
      </div>

      <div class="well">
        <div ref="genresRef">
          <table key="table" class="genretable">
            <thead>
              <tr>
                <th v-for="genre in toyGenres.data" :key="genre.resource_id">
                  <router-link :to="{ path: `/toy/${genre.route}` }">{{ genre.name }}</router-link>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <TOYGenre v-if="isGenreRoute" :genre="genreProps" :extractFields="extractFields" />
    </transition-group>
  </section>
</template>

<script lang="ts">
import api from '~/api'
import { defineComponent, reactive, computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { slugify } from '~/shared/slugify'
import { TTOYFolder, TTOYEntity, TTOYData } from '~/types/TOY'
import SimpleBar from 'simplebar'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import TOYGenre from './_genre/index.vue'

export default defineComponent({
  components: {
    AppPreloader,
    TOYGenre
  },

  setup() {
    const route = useRoute()
    const genresRef = ref(null)
    const simplebar = ref<any>(null)

    const toyGenres = reactive<TTOYData>({
      isFetched: false,
      data: []
    })

    const folderKeys: Array<keyof TTOYFolder> = ['name', 'path', 'resource_id']

    const extractFields = (row: TTOYFolder) => (
      folderKeys
        .reduce((acc, next) => {
          acc[next] = row[next]
          acc.route = slugify(row.name)
          return acc
        }, {} as TTOYEntity)
    )

    const fetchTOYTable = async () => {
      try {
        const response = await api.get<TTOYFolder[]>('/api/toy')

        if (response?.status === 200) {
          // @ts-ignore
          toyGenres.data = response?.data.map<TTOYEntity[]>(extractFields)
          toyGenres.isFetched = true
        }
      } catch (error) {
        throw error
      }
    }

    const genreProps = computed(() => toyGenres.data.find((genre) => (
      genre.route === route.params?.genre
    )))

    const isGenreRoute = computed(() => (
      toyGenres.isFetched && (route.name === 'TOYGenre' || route.name === 'TOYYear')
    ))

    onMounted(() => fetchTOYTable())

    onMounted(() => {
      if (genresRef.value) {
        simplebar.value = new SimpleBar(genresRef.value, { autoHide: false })
      }
    })

    return {
      genresRef,
      toyGenres,
      genreProps,
      extractFields,
      isGenreRoute
    }
  }
})

</script>

<style lang="scss">
.well {
  min-width: 100%;
  overflow: hidden;
  position: relative;
  padding: 0 25px;
}

.genretable {
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 100%;

  th {
    text-align: center;
    padding: 25px 10px;

    a {
      color: #828c9b;
      white-space: nowrap;

      &.router-link-active {
        color: #f51e38;
      }
    }
  }
}
</style>
