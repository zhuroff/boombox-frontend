<template>
  <div class="hero">
    <div class="hero__poster">
      <img
        v-if="category.poster"
        :src="host(category.poster)"
        :alt="category.title"
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
      <div class="hero__avatar">
        <img
          v-if="category.avatar"
          :src="host(category.avatar)"
          :alt="category.title"
          class="hero__avatar_image"
        >

        <form class="hero__avatar_form">
          <label class="hero__avatar_label">
            <input
              type="file"
              ref="avatarElement"
              @change="setAvatar"
            >
            <AppSprite name="camera" />
          </label>
        </form>
      </div>

      <div class="hero__content">
        <div class="hero__title">{{ category.title }}</div>
        <div class="hero__albums">Albums: {{ category.albums.length }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CategoryImagesKeys } from '~/types/Category'
import { hostString } from '~/shared/media'
import AppSprite from '~/components/AppSprite.vue'
import api from '~/api'
import './Hero.scss'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    category: {
      type: Object,
      required: true
    },

    categorySlug: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const route = useRoute()

    const posterElement: Ref<null | HTMLInputElement> = ref(null)
    const avatarElement: Ref<null | HTMLInputElement> = ref(null)

    const uploadImage = async (file: any, fieldname: CategoryImagesKeys) => {
      const formData = new FormData()
      const url = `/api/${props.categorySlug}/${route.params.id}/${fieldname}`

      formData.append(fieldname, file)

      try {
        const response = await api.post(url, formData)
        emit('setCategoryImage', { key: fieldname, url: response.data[fieldname] })
      } catch (error) {
        console.error(error)
      }
    }

    const setPoster = () => {
      if (posterElement.value?.files?.length) {
        uploadImage(posterElement.value.files[0], 'poster')
      }
    }

    const setAvatar = () => {
      if (avatarElement.value?.files?.length) {
        uploadImage(avatarElement.value.files[0], 'avatar')
      }
    }

    const host = (pathname: string) => hostString(pathname)

    return {
      posterElement,
      avatarElement,
      setPoster,
      setAvatar,
      host
    }
  }
})

</script>
