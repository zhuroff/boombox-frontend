<template>
  <div class="avatar">
    <img
      v-if="avatarUrl"
      :src="avatarUrl"
      :alt="entityTitle"
      class="avatar__image"
    >
    <form
      v-if="isAdmin"
      class="avatar__form"
    >
      <label
        v-if="!isMobile"
        class="avatar__label"
      >
        <input
          type="file"
          ref="avatarElement"
          :disabled="isMobile"
          @change="upload"
        >
        <Sprite name="camera" />
      </label>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { Sprite } from '~shared/UI'
import { useUser, useDevice } from '~shared/model'

interface Props {
  avatarUrl: string | null
  entityTitle: string
}

interface Emits {
  (e: 'uploadAvatar', payload: ['avatar', File | undefined]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { isAdmin } = useUser()
const { isMobile } = useDevice()

const avatarElement: Ref<null | HTMLInputElement> = ref(null)

const upload = () => {
  emit('uploadAvatar', ['avatar', avatarElement.value?.files?.[0]])
}
</script>

<style scoped lang="scss">
@use '~/app/styles/variables' as var;

.avatar {
  margin: 0 25px;
  position: relative;
  z-index: 3;

  @include var.media('<desktop') {
    display: none;
  }

  @include var.media('>=desktop') {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    flex: none;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    & + .avatar__form {
      opacity: 0;

      &:hover {
        opacity: 1;
      }
    }
  }

  &__form {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var.$black;
    opacity: 1;
    transition: opacity 0.3s var.$animation;
  }

  &__label {
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
      color: var.$white;
    }
  }
}
</style>
