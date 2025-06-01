<template>
  <div class="poster">
    <img
      v-if="posterUrl"
      :src="posterUrl"
      :alt="entityTitle"
      class="poster__image"
    >
    <form
      v-if="isAdmin"
      class="poster__form"
    >
      <label class="poster__label">
        <input
          type="file"
          ref="posterElement"
          @change="upload"
        >
        <Sprite name="camera" />
      </label>
    </form>
    <slot name="hero-content"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { Sprite } from '~shared/UI'
import { useUser } from '~entities/user'

interface Props {
  posterUrl: string | null
  entityTitle: string
}

interface Emits {
  (e: 'uploadPoster', payload: ['poster', File | undefined]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { isAdmin } = useUser()

const posterElement: Ref<null | HTMLInputElement> = ref(null)

const upload = () => {
  emit('uploadPoster', ['poster', posterElement.value?.files?.[0]])
}
</script>

<style scoped lang="scss">
@use '~/scss/variables' as var;

.poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &:before {
    content: '';
    background-color: var.$transBlack;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__form {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__label {
    width: 78px;
    height: 78px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.3s var.$animation;

    input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      outline: none;
    }

    .icon {
      color: var.$white;
    }
  }
}
</style>
