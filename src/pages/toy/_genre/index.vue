<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!toyGenre.isFetched" mode="light" />
    </transition>

    <transition name="flyUp">
      <div>
        <div v-if="isGenreRoute" class="wellwell">
          <ul v-if="toyGenre.isFetched" class="cardlist" key="list">
            <li v-for="year in toyGenre.data" :key="year.resource_id">
              <router-link :to="{ path: `/toy/${genre?.route}/${year.route}` }">{{ year.name }}</router-link>
            </li>
          </ul>
        </div>
        <TOYYear v-if="!isGenreRoute && toyGenre.isFetched" :year="yearProps" />
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import api from '~/api'
import { PropType, defineComponent, reactive, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { TTOYFolder, TTOYEntity, TTOYData } from '~/types/TOY'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import TOYYear from '../_year/index.vue'

export default defineComponent({
  components: {
    AppPreloader,
    TOYYear
  },

  props: {
    genre: {
      type: Object as PropType<TTOYEntity>,
      required: false
    },

    extractFields: {
      type: Function as PropType<(row: TTOYFolder) => TTOYEntity>,
      required: true
    }
  },

  setup(props) {
    const route = useRoute()

    const toyGenre = reactive<TTOYData>({
      isFetched: false,
      data: []
    })

    const fetchGenreYears = async () => {
      try {
        const response = await api.post<any[]>('/api/toy', { path: props.genre?.path })

        if (response?.status === 200) {
          toyGenre.data = response?.data.map(props.extractFields)
          toyGenre.isFetched = true
        }
      } catch (error) {
        throw error
      }
    }

    const isGenreRoute = computed(() => (
      route.name === 'TOYGenre'
    ))

    const yearProps = computed(() => {
      return {
        ...toyGenre.data.find((year) => (
          year.route === route.params?.year
        )),
        genre: props.genre?.name
      }
    })

    watchEffect(() => {
      toyGenre.isFetched = false
      fetchGenreYears()
    })

    return {
      toyGenre,
      isGenreRoute,
      yearProps
    }
  }
})
</script>

<style lang="scss">
.wellwell {
  padding: 0 15px;
}
</style>
