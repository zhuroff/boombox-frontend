<template>
  <transition name="fade">
    <Preloader
      v-if="isLoading"
      mode="light"
    />
  </transition>
  <ul
    v-if="!isLoading && rootFolders.size"
    class="toylist"
  >
    <TOYGenreCard
      v-for="[key, value] in rootFolders"
      :key="key"
      :card="value"
      rootPath="toy"
    />
  </ul>
  <div
    v-else-if="!isLoading && !rootFolders.size"
    class="toyempty"
  >{{ localize('toy.emptyGenres') }}</div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { CloudEntity } from '~/types/ReqRes'
import useGlobalStore from '~/store/global'
import Preloader from '~/components/Preloader.vue'
import TOYGenreCard from '~/components/Cards/TOYGenreCard.vue'
import cloudServices from '~/services/cloud.services'

const {
  globalGetters: { localize }
} = useGlobalStore()

const isLoading = ref(true)
const rootFolders = reactive<Map<string, CloudEntity>>(new Map())

const fetchTOYTable = async () => {
  try {
    const rootFolder = await cloudServices.getFolderContent({
      path: '',
      cloudURL: String(process.env.VUE_APP_TOY_CLOUD),
      root: 'TOY'
    })

    rootFolder.items.forEach((item) => {
      if (!item.mimeType) {
        rootFolders.set(
          item.title,
          {
            ...item,
            path: decodeURIComponent(item.path).replace('/', '')
          }
        )
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTOYTable()
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';

.toylist {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  height: 100%;
  padding: 25px;
}
</style>
