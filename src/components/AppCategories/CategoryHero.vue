<template>
  
<div class="hero">
  <div class="hero__poster">
    <img
      v-if="category.poster"
      :src="category.poster"
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
        :src="category.avatar"
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
import AppSprite from '~/components/AppSprite.vue'
import api from '~/api'

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

  setup(props) {
    const route = useRoute()

    const posterElement: Ref<null | HTMLInputElement> = ref(null)
    const avatarElement: Ref<null | HTMLInputElement> = ref(null)

    const uploadImage = async (file: any, fieldname: string) => {
      const formData = new FormData()
      const url = `/api/${props.categorySlug}/${route.params.id}/${fieldname}`

      formData.append(fieldname, file)

      try {
        const response = await api.post(url, formData)
        console.log(response)
        // props.category.updateCategoryImages(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const setPoster = () => {
      if (posterElement.value) {
        // uploadImage(posterElement.value.files[0], 'poster')
      }
    }

    const setAvatar = () => {
      if (avatarElement.value) {
        // uploadImage(avatarElement.value.files[0], 'avatar')
      }
    }

    return {
      posterElement,
      avatarElement,
      setPoster,
      setAvatar
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.hero {

  &__poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:before {
      content: '';
      background-color: rgba(0, 0, 0, 0.75);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &:hover {

      .hero__poster_label {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    &_image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &_form {
      position: absolute;
      top: 0;
      right: 0;
    }

    &_label {
      width: 78px;
      height: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
      
      input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        outline: none;
      }

      .icon {
        color: $white;
      }
    }
  }

  &__info {
    position: absolute;
    bottom: 25px;
    left: 25px;
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: 78px;
    height: 78px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

    &_image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &_form {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.75);
      opacity: 0;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 1;
        transition: opacity 0.3s ease;
      }
    }

    &_label {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        outline: none;
      }

      .icon {
        color: $white;
      }
    }
  }

  &__content {
    margin-left: 15px;
  }

  &__title {
    font-weight: 600;
    font-size: 28px;
    line-height: 34px;
    text-transform: uppercase;
    color: $white;
  }

  &__albums {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: $white;
  }
}

</style>