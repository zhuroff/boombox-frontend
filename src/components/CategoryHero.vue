<template>
  <div class="hero">
    <div class="hero__poster">
      <img
        v-if="data.poster"
        :src="host(data.poster)"
        :alt="data.title"
        class="hero__poster-image"
      >
      <form class="hero__poster-form">
        <label class="hero__poster-label">
          <input
            type="file"
            ref="posterElement"
            @change="() => saveImage('poster', posterElement)"
          >
          <Sprite name="camera" />
        </label>
      </form>
      <slot name="hero-content"></slot>
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
          class="hero__avatar-image"
        >
        <form class="hero__avatar-form">
          <label class="hero__avatar-label">
            <input
              type="file"
              ref="avatarElement"
              @change="() => saveImage('avatar', avatarElement)"
            >
            <Sprite name="camera" />
          </label>
        </form>
      </div>
      <div class="hero__content">
        <input
          v-if="isEditable"
          type="text"
          class="hero__title"
          v-model="heroTitle"
        >
        <div
          v-else
          class="hero__title"
        >{{ heroTitle }}</div>
        <div class="hero__description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType, Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ImagePayload, EntityImagesKeys } from '~/types/Common'
import { hostString } from '~/utils'
import CategoryPage from '~/classes/CategoryPage'
import Sprite from '~/components/Sprite/Sprite.vue'
import UploadServices from '~/services/UploadServices'

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
    entity: {
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
    },
    isEditable: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props, { emit }) {
    const route = useRoute()
    const posterElement: Ref<null | HTMLInputElement> = ref(null)
    const avatarElement: Ref<null | HTMLInputElement> = ref(null)
    const inputTimer: Ref<ReturnType<typeof setTimeout> | number> = ref(0)
    const heroTitle = ref(props.data.title)

    const saveImage = (type: EntityImagesKeys, element: HTMLInputElement | null) => {
      if (element?.files?.length) {
        const payload: ImagePayload = {
          file: element.files[0],
          type,
          slug: props.entity,
          id: String(route.params.id)
        }

        UploadServices.uploadImage<CategoryPage>(payload)
          .then((data) => {
            emit('setUploadedImage', {
              key: payload.type,
              url: data[type]
            })
          })
          .catch(console.error)
      }
    }

    const host = (pathname: string) => hostString(pathname)

    watch(heroTitle, (newValue) => {
      if (typeof inputTimer.value === 'number') {
        clearTimeout(inputTimer.value)
        
        inputTimer.value = setTimeout(() => {
          emit('saveTitle', newValue)
        }, 1000)
      }
    })

    return {
      posterElement,
      avatarElement,
      heroTitle,
      saveImage,
      host
    }
  }
})

</script>

<style lang="scss">
@import '../scss/variables';
@import 'include-media';

.hero {

  &:hover {

    .hero__poster-label {
      opacity: 1;
      transition: opacity 0.3s $animation;
    }
  }

  &__poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:before {
      content: '';
      background-color: $transBlack;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-form {
      position: absolute;
      top: 0;
      right: 0;
    }

    &-label {
      width: 78px;
      height: 78px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s $animation;
      
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
    left: 0;
    width: 0;
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__avatar {
    margin: 0 25px;
    position: relative;
    z-index: 3;

    @include media('<tablet') {
      display: none;
    }

    @include media('>=tablet') {
      width: 10rem;
      height: 10rem;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      flex: none;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;

      & + .hero__avatar-form {
        opacity: 0;

        &:hover {
          opacity: 1;
        }
      }
    }

    &-form {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: $black;
      opacity: 1;
      transition: opacity 0.3s $animation;
    }

    &-label {
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
    padding: 0.5rem 25px 1rem 13rem;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: $transBlack;
    width: 100%;
    box-shadow: $shadowMedium;
  }

  &__title {
    color: $warning;
    padding: 0;
    border: 0;
    box-shadow: none;
    outline: none;
    background-color: transparent;
    width: 100%;

    @include media('<tablet') {
      @include serif(2rem, 600);
    }

    @include media('>=tablet') {
      @include serif(3rem, 600);
    }
  }

  &__description {
    font-weight: 600;
    font-size: 1rem;
    color: $white;
  }
}
</style>
