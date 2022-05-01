<template>  
  <div class="float-modal">
    <transition name="fade">
      <AppPreloader
        v-if="!isFetched"
        mode="light"
      />
    </transition>

    <transition name="flyUp">
      <div class="float-modal__content">
        <slot
          v-if="isFetched && isEmpty"
          name="empty"
        />

        <slot
          v-if="isFetched && !isEmpty"
          name="list"
        />

        <form
          v-if="isFetched"
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
import AppPreloader from '~/components/Preloader/Preloader.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import './FloatModal.scss'

export default defineComponent({
  name: 'FloatModal',

  components: {
    AppPreloader,
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
      required: true
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
