<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="entity"
    :entityType="entityType"
    :discogsTablePayload="discogsTablePayload"
    :getBooklet="() => fetchBooklet(`${entity.folderName}/booklet`)"
    :getRandomAlbum="() => getRandomAlbum(entityType)"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { AlbumPage } from '~/types/Album'
import { useAlbumPage } from '~/hooks/useAlbumPage'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate
  },
  setup() {
    const {
      fetchData,
      entity,
      isDataFetched,
      fetchBooklet,
      getRandomAlbum,
      fetchDiscogsInfo,
      discogsTablePayload,
      route
    } = useAlbumPage<AlbumPage>()

    const entityType = ref('albums')

    onMounted(() => {
      fetchData(entityType.value)
        .then((payload) => payload && fetchDiscogsInfo(payload))
    })

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== entity._id) {
          fetchData(entityType.value)
            .then((payload) => payload && fetchDiscogsInfo(payload))
        }
      },
      { immediate: false }
    )

    return {
      isDataFetched,
      entity,
      entityType,
      fetchBooklet,
      getRandomAlbum,
      discogsTablePayload
    }
  },
});
</script>
