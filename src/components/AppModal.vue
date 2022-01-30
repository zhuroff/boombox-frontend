<template>  
  <div class="modal">
    <button
      class="modal__close"
      @click="closeModal"
    >
      <AppSprite name="delete" />
    </button>
    
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { defineComponent, watchEffect } from 'vue'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    isModalActive: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const closeModal = () => emit('closeModal')

    watchEffect(() => {
      if (props.isModalActive) {
        document.querySelector('.header')?.classList.add('--z-low')
        document.querySelector('.player')?.classList.add('--z-low')
      } else {
        document.querySelector('.header')?.classList.remove('--z-low')
        document.querySelector('.player')?.classList.remove('--z-low')
      }
    })

    return { closeModal }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

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
  z-index: 5000;
  background-color: rgba(0, 0, 0, 0.75);

  &__close {
    @include buttonClose;
  }
}

</style>
