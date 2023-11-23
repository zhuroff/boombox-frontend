<template>
  <div class="toycontent">
    <transition name="fade">
      <Preloader v-if="!toyGenre.isFetched" mode="light" />
    </transition>

    <div>
      <div v-if="isGenreRoute">
        <ul v-if="toyGenre.isFetched" class="toylist --small --inner">
          <li v-for="year in toyGenre.data" :key="year.resource_id" class="toylist__item --light">
            <router-link :to="{ path: `/toy/${genre?.route}/${year.route}` }" class="toylist__year">{{ year.name }}
            </router-link>
          </li>
        </ul>
      </div>
      <TOYYear v-if="!isGenreRoute && toyGenre.isFetched" :year="yearProps" />
    </div>
  </div>
</template>

<script lang="ts">
import api from '~/api'
import { PropType, defineComponent, reactive, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { TTOYFolder, TTOYEntity, TTOYData } from '~/types/TOY'
import { slugify } from '~/utils'
import Preloader from '~/components/Preloader.vue'
import TOYYear from '../_year/index.vue'

export default defineComponent({
  components: {
    Preloader,
    TOYYear
  },

  props: {
    genre: {
      type: Object as PropType<TTOYEntity>,
      required: false
    },
    folderKeys: {
      type: Array as PropType<Array<keyof TTOYFolder>>,
      required: true
    }
  },

  setup(props) {
    const route = useRoute()

    const toyGenre = reactive<TTOYData>({
      isFetched: false,
      data: []
    })

    const buildTOYYears = (data: TTOYFolder[]) => {
      // @ts-ignore
      toyGenre.data = data.map<TTOYEntity[]>((folder) => (
        props.folderKeys.reduce((acc, next) => {
          // @ts-ignore
          acc[next] = folder[next]
          acc.route = slugify(folder.name)
          return acc
        }, {} as TTOYEntity)
      ))
    }

    const fetchGenreYears = async () => {
      try {
        const response = await api.post<any[]>('/api/toy', { path: props.genre?.path })

        if (response?.status === 200) {
          buildTOYYears(response.data)
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
@import '~/scss/variables';

.toylist {

  &__year {
    padding: 10px;
    font-size: 0.875rem;
    display: block;
    text-align: center;
    color: $black;
  }
}
</style>
