<template>
  <transition name="fade">
    <Preloader
      v-if="isPageLoading"
      mode="light"
    />
  </transition>
  <div
    v-if="!isPageLoading && genreFolders.size"
    class="toygenres"
  >
    <Header
      :heading="params?.title || ''"
      :withSearch="false"
    />
    <ul class="toygenres__list">
      <TOYYearCard
        v-for="[key, value] in genreFolders"
        :key="key"
        :card="value"
        :rootPath="`toy/${slugify(params?.path || '')}`"
      />
    </ul>
  </div>
  <div
    v-else-if="!isPageLoading && !genreFolders.size"
    class="toyempty"
  >{{ lang('toy.emptyYears') }}</div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref, watch } from 'vue'
import { CloudEntity } from '~/types/ReqRes'
import { useLocales } from '~/hooks/useLocales'
import { slugify } from '~/utils'
import cloudServices from '~/services/cloud.services'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import TOYYearCard from '~/components/Cards/TOYYearCard.vue'

export default defineComponent({
  name: 'TOYGenrePage',
  components: {
    Preloader,
    Header,
    TOYYearCard
  },
  props: {
    params: {
      type: Object as PropType<CloudEntity>,
      required: false
    }
  },
  setup(props) {
    const { lang } = useLocales()
    const isPageLoading = ref(true)
    const genreFolders = reactive<Map<string, CloudEntity>>(new Map())

    const fetchTOYYears = async (path: string) => {
      try {
        const genreFolder = await cloudServices.getFolderContent(
          '',
          String(process.env.VUE_APP_TOY_CLOUD),
          encodeURIComponent(path)
        )

        genreFolder.items.forEach((item) => {
          if (!item.mimeType && item.title.length === 4) {
            genreFolders.set(
              item.title,
              {
                ...item,
                path: decodeURIComponent(item.path).replace('MelodyMap/TOY/', '')
              }
            )
            
          }
        })

        isPageLoading.value = false
      } catch (error) {
        console.error(error)
      }
    }

    watch(
      props,
      (value) => {
        if (value.params) {
          fetchTOYYears(`TOY/${value.params.path}`)
        }
      },
      { immediate: true, deep: true }
    )

    return {
      isPageLoading,
      genreFolders,
      slugify,
      lang
    }
  }
})
</script>

<style lang="scss" scoped>
.toygenres {

  &__list {
    padding: 25px;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(10, 1fr);
  }
}
</style>
