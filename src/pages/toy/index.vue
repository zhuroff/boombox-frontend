<template>
  <section class="toy">
    <TOYRootPage
      v-if="route.name === 'toy'"
      :isRootLoading="isRootLoading"
      :data="rootFolders"
    />
    <TOYGenrePage
      v-else-if="route.name === 'toy-genre'"
      :params="genrePageParams"
    />
    <TOYYearPage
      v-else-if="route.name === 'toy-year'"
      :params="genrePageParams"
      :title="String(route.params.year)"
      :backPath="`/toy/${String(route.params.genre)}`"
    />
  </section>
</template>

<script lang="ts">
import { computed, reactive, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CloudEntity } from '~/types/ReqRes'
import { slugify } from '~/utils'
import cloudServices from '~/services/cloud.services'
import TOYRootPage from './_root/index.vue'
import TOYGenrePage from './_genre/index.vue'
import TOYYearPage from './_year/index.vue'

export default defineComponent({
  components: {
    TOYRootPage,
    TOYGenrePage,
    TOYYearPage
  },

  setup() {
    const rootFolders = reactive<Map<string, CloudEntity>>(new Map())
    const isRootLoading = ref(true)
    const route = useRoute()

    const genrePageParams = computed(() => {
      return rootFolders.get(String(route.params.genre))
    })

    const fetchTOYTable = async () => {
      try {
        const rootFolder = await cloudServices.getFolderContent('', String(process.env.VUE_APP_TOY_CLOUD), 'TOY')

        rootFolder.items.forEach((item) => {
          if (!item.mimeType) {
            rootFolders.set(
              slugify(decodeURIComponent(item.path)),
              {
                ...item,
                path: decodeURIComponent(item.path).replace('/', '')
              }
            )
          }
        })
        
        isRootLoading.value = false
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(() => {
      fetchTOYTable()
    })

    return {
      route,
      isRootLoading,
      rootFolders,
      genrePageParams
    }
  }
})

</script>

<style lang="scss">
@import '~/scss/variables';

.toy {
  height: calc(100vh - #{$playerHeight});
}

.toyempty {
  @include serif(3rem);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
