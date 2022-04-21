<template>
  <div class="hero">
    <div class="hero__poster">
      <img
        v-if="collection.poster"
        :src="host(collection.poster)"
        :alt="collection.title"
        class="hero__poster_image"
      >

      <form class="hero__poster_form">
        <label class="hero__poster_label">
          <input
            type="file"
            ref="posterElement"
            @change="setPoster"
          >
          <AppSprite name="camera" />
        </label>
      </form>
    </div>

    <div class="hero__info">
      <div class="hero__content">
        <div class="hero__title">{{ collection.title }}</div>
        <div class="hero__albums">{{ keyWord }}: {{ collection.albums?.length || collection.tracks?.length }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ImagePayload } from '~/types/Global'
import { CollectionPageItem } from '~/types/Collection'
import { hostString } from '~/shared/media'
import AppSprite from '~/components/AppSprite.vue'
import UploadServices from '~/services/UploadServices'
import './Hero.scss'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    keyWord: {
      type: String,
      required: true
    },

    collection: {
      type: Object as PropType<CollectionPageItem>,
      required: true
    }
  },

  setup(_, { emit }) {
    const route = useRoute()

    const posterElement: Ref<null | HTMLInputElement> = ref(null)

    const setPoster = () => {
      if (posterElement.value?.files?.length) {
        const payload: ImagePayload = {
          file: posterElement.value.files[0],
          type: 'poster',
          slug: 'collections',
          id: String(route.params.id)
        }

        UploadServices.uploadImage<CollectionPageItem>(payload)
          .then((data) => emit('setCollectionImage', {
            key: payload.type,
            url: data.poster
          }))
          .catch((error) => console.dir(error))
      }
    }

    const host = (pathname: string) => hostString(pathname)

    return {
      posterElement,
      setPoster,
      host
    }
  }
})

</script>
