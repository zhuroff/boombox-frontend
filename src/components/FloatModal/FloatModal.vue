<template>  
  <div class="float-modal">
    <transition name="fade">
      <Preloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>

    <transition name="flyUp">
      <div class="float-modal__content">
        <slot
          v-if="isFetched && isEmpty"
          name="empty"
        ></slot>

        <slot
          v-else-if="isFetched && !isEmpty"
          name="list"
        ></slot>

        <form
          v-if="isFetched && placeholder"
          class="float-modal__create"
          key="form"
          @submit.prevent="createNewEntry"
        >
          <input
            type="text"
            class="float-modal__input"
            :placeholder="placeholder"
            v-model="listName"
          >

          <button
            class="float-modal__submit"
            type="submit"
            :disabled="!listName.length"
          >
            <span>OK</span>
          </button>

          <button
            class="float-modal__submit"
            type="button"
            @click="closeFloatModal"
          >
            <Sprite name="delete" />
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import Preloader from '~/components/Preloader.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import './FloatModal.scss'

export default defineComponent({
  name: 'FloatModal',

  components: {
    Preloader,
    Sprite
  },

  props: {
    isFetched: {
      type: Boolean,
      required: true
    },

    isEmpty: {
      type: Boolean,
      required: true
    },

    placeholder: {
      type: String,
      required: false
    }
  },

  setup(_, { emit }) {
    const listName = ref('')

    const closeFloatModal = () => {
      emit('closeFloatModal')
    }

    const createNewEntry = () => {
      emit('createNewEntry', listName.value)
    }

    return {
      listName,
      createNewEntry,
      closeFloatModal
    }
  }
})

</script>
