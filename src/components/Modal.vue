<template>  
  <div class="modal">
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
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import Button from '~/components/Button.vue'

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
@import '~/scss/variables';
@import 'include-media';

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  padding: 50px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9000;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.75);

  &__close {
    @include buttonClose;

    @include media('<laptop') {
      left: 25px;
      right: auto
    }
  }
}
</style>
