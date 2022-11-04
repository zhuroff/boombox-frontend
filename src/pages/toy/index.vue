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

      <!-- <ul v-if="toyGenres.isFetched" class="genrelist" key="list">
        <li v-for="genre in toyGenres.data" :key="genre.resource_id">
          <router-link :to="{ path: `/toy/${genre.route}` }">{{ genre.name }}</router-link>
        </li>
      </ul> -->
      <div class="well">
        <table v-if="toyGenres.isFetched" key="table" class="genretable">
          <thead>
            <tr>
              <th v-for="genre in toyGenres.data" :key="genre.resource_id">
                <router-link :to="{ path: `/toy/${genre.route}` }">{{ genre.name }}</router-link>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <TOYGenre v-if="isGenreRoute" :genre="genreProps" :extractFields="extractFields" />
    </transition-group>
  </section>
</template>

<script lang="ts">
import api from '~/api'
import { defineComponent, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { slugify } from '~/shared/slugify'
import { TTOYFolder, TTOYEntity, TTOYData } from '~/types/TOY'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import TOYGenre from './_genre/index.vue'

export default defineComponent({
  components: {
    AppPreloader,
    TOYGenre
  },

  setup() {
    const route = useRoute()

    const toyGenres = reactive<TTOYData>({
      isFetched: false,
      data: []
    })

    const extractFields = (row: TTOYFolder) => (
      ['name', 'path', 'resource_id']
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
          toyGenres.data.push(...toyGenres.data)
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

    return {
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
  width: 100%;
  overflow: auto;
  position: relative;
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

// .genrelist {
//   display: flex;
//   justify-content: space-between;
//   padding: 25px;

//   a {
//     color: #828c9b;

//     &.router-link-active {
//       color: #f51e38;
//     }
//   }
// }
</style>
