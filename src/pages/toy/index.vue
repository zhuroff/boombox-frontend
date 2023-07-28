<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!toyGenres.isFetched" mode="light" />
    </transition>

    <div class="section__heading" key="heading">
      <h1 class="section__title">
        Tracks of the Years
      </h1>
    </div>

    <ul :class="[{ '--small': isGenreRoute }, 'toylist']">
      <TOYGenreCard v-for="genre in toyGenres.data" :key="genre.resource_id" :content="genre" />
    </ul>

    <TOYGenre v-if="isGenreRoute" :genre="genreProps" :folderKeys="folderKeys" />
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
import TOYGenreCard from '~/components/Cards/TOYGenreCard.vue'
import TOYGenre from './_genre/index.vue'

export default defineComponent({
  components: {
    AppPreloader,
    TOYGenre,
    TOYGenreCard
  },

  setup() {
    const route = useRoute()
    const genresRef = ref(null)
    const simplebar = ref<any>(null)

    const toyGenres = reactive<TTOYData>({
      isFetched: false,
      data: []
    })

    const folderKeys: Array<keyof TTOYFolder> = ['name', 'path', 'resource_id', 'file']

    const buildTOYContent = (data: TTOYFolder[]) => {
      const folders: TTOYFolder[] = []
      const images: Partial<TTOYFolder>[] = []

      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'dir') {
          folders.push(data[i])
        } else {
          images.push(data[i])
        }
      }

      // @ts-ignore
      toyGenres.data = folders.map<TTOYEntity[]>((folder) => {
        const t = folderKeys.reduce((acc, next) => {
          // @ts-ignore
          acc[next] = folder[next]
          acc.route = slugify(folder.name)
          acc.file = images.find(({ name }) => name?.replace(/\.[^.]+$/, "") === folder.name)?.file
          return acc
        }, {} as TTOYEntity)
        return t
      })
    }

    const fetchTOYTable = async () => {
      try {
        const response = await api.get<TTOYFolder[]>('/api/toy')

        if (response?.status === 200) {
          buildTOYContent(response.data)
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
      isGenreRoute,
      folderKeys
    }
  }
})

</script>

<style lang="scss">
@import '~/scss/variables';

.toylist {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 25px;
  flex: 1 1 0;

  &.--small {
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    flex: initial;
    padding-bottom: 12px;
  }

  &.--inner {
    padding: 12px 0 0;
    margin: 0 25px;
    border-top: 1px solid $pale;
  }
}
</style>