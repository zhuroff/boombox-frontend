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
        <div class="hero__albums">Albums: {{ collection.albums.length }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType, Ref, ref } from 'vue'
import { CollectionPageItem } from '~/types/Collection'
import { CategoryImagesKeys } from '~/types/Category'
import AppSprite from '~/components/AppSprite.vue'
import './Hero.scss'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    collection: {
      type: Object as PropType<CollectionPageItem>,
      required: true
    }
  },

  setup() {
    const posterElement: Ref<null | HTMLInputElement> = ref(null)

    const uploadImage = async (file: any, fieldname: CategoryImagesKeys) => {
      // const formData = new FormData()
      // const url = `/api/${props.categorySlug}/${route.params.id}/${fieldname}`

      // formData.append(fieldname, file)

      // try {
      //   const response = await api.post(url, formData)
      //   emit('setCategoryImage', { key: fieldname, url: response.data[fieldname] })
      // } catch (error) {
      //   console.error(error)
      // }
    }

    const setPoster = () => {
      if (posterElement.value?.files?.length) {
        uploadImage(posterElement.value.files[0], 'poster')
      }
    }

    return {
      setPoster
    }
  }
})

</script>
