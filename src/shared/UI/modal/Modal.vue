<template>
  <transition name="fade">
    <div
      v-if="isModalActive"
      class="modal"
    >
      <Button
        class="modal__close"
        icon="close"
        size="large"
        isText
        isInverted
        @click="closeModal"
      />    
      <slot></slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import { Button } from '~shared/UI'

interface Props {
  isModalActive: boolean
}

interface Emits {
  (e: 'closeModal'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const closeModal = () => {
  document.querySelector('.aside')?.classList.remove('--z-low')
  document.querySelector('.player')?.classList.remove('--z-low')
  document.querySelector('.section')?.classList.remove('--z-low')
  emit('closeModal')
}

watchEffect(() => {
  if (props.isModalActive) {
    document.querySelector('.aside')?.classList.add('--z-low')
    document.querySelector('.player')?.classList.add('--z-low')
    document.querySelector('.section')?.classList.add('--z-low')
  }
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  padding: calc(var.$mainPadding * 2) var.$mainPadding;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9000;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.75);

  &__close {
    @include var.buttonClose;

    @include var.media('<desktop') {
      top: 0.25rem;
    }
  }
}
</style>
