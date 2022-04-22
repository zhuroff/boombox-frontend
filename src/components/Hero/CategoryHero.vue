<template>
  <div class="hero">
    <div class="hero__poster">
      <img
        v-if="data.poster"
        :src="host(data.poster)"
        :alt="data.title"
        class="hero__poster_image"
      >

      <form class="hero__poster_form">
        <label class="hero__poster_label">
          <input
            type="file"
            ref="posterElement"
            @change="setPoster"
          >
          <Sprite name="camera" />
        </label>
      </form>
    </div>

    <div class="hero__info">
      <div
        v-if="!noAvatar"
        class="hero__avatar"
      >
        <img
          v-if="data.avatar"
          :src="host(data.avatar)"
          :alt="data.title"
          class="hero__avatar_image"
        >

        <form class="hero__avatar_form">
          <label class="hero__avatar_label">
            <input
              type="file"
              ref="avatarElement"
              @change="setAvatar"
            >
            <Sprite name="camera" />
          </label>
        </form>
      </div>

      <div class="hero__content">
        <div class="hero__title">{{ data.title }}</div>
        <div class="hero__description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType, Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ImagePayload } from '~/types/Global'
import { CategoryPage } from '~/types/Category'
import { hostString } from '~/shared/media'
import Sprite from '~/components/Sprite/Sprite.vue'
import UploadServices from '~/services/UploadServices'
import './Hero.scss'

export default defineComponent({
  name: 'CategoryHero',

  components: {
    Sprite
  },

  props: {
    data: {
      type: Object as PropType<CategoryPage>,
      required: true
    },

    slug: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    noAvatar: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    const route = useRoute()

    const posterElement: Ref<null | HTMLInputElement> = ref(null)
    const avatarElement: Ref<null | HTMLInputElement> = ref(null)

    const setPoster = () => {
      if (posterElement.value?.files?.length) {
        const payload: ImagePayload = {
          file: posterElement.value.files[0],
          type: 'poster',
          slug: props.slug,
          id: String(route.params.id)
        }

        UploadServices.uploadImage<CategoryPage>(payload)
          .then((data) => emit('setUploadedImage', {
            key: payload.type,
            url: data.poster
          }))
          .catch((error) => console.dir(error))
      }
    }

    const setAvatar = () => {
      if (avatarElement.value?.files?.length) {
        const payload: ImagePayload = {
          file: avatarElement.value.files[0],
          type: 'avatar',
          slug: props.slug,
          id: String(route.params.id)
        }

        UploadServices.uploadImage<CategoryPage>(payload)
          .then((data) => emit('setUploadedImage', {
            key: payload.type,
            url: data.avatar
          }))
          .catch((error) => console.dir(error))
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
