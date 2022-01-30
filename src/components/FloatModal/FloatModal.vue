<template>  
  <div class="float-modal">
    <transition name="fade">
      <AppPreloader
        v-if="!data.isFetched"
        mode="light"
      />
    </transition>

    <transition-group name="flyUp">
      <button
        class="float-modal__close"
        key="close"
        @click="closeFloatModal"
      >
        <AppSprite name="delete" />
      </button>

      <ul
        v-if="data.isFetched && data.data.length"
        class="float-modal__list"
        key="list"
      >
        <FloatModalItem
          v-for="item in data.data"
          :key="item._id"
          :item="item"
          :itemID="itemID"
          @checkFloatModalItem="checkFloatModalItem"
        />
      </ul>

      <div
        v-if="data.isFetched && !data.data.length"
        class="float-modal__empty"
        key="empty"
      >
        <strong>You haven't created any collections yet</strong>
        <span>To create a collection, use the form below</span>
      </div>

      <form
        v-if="data.isFetched"
        class="float-modal__create"
        key="form"
        @submit.prevent="createNewCollection"
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
      </form>
    </transition-group>
  </div>
</template>

<script lang="ts">

import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { IFloatModal } from '~/types/Global'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import AppSprite from '~/components/AppSprite.vue'
import FloatModalItem from './FloatModalItem.vue'
import './FloatModal.scss'

export default defineComponent({
  components: {
    AppPreloader,
    AppSprite,
    FloatModalItem
  },

  props: {
    data: {
      type: Object as () => IFloatModal,
      required: true
    },

    itemID: {
      type: String,
      required: true
    },

    placeholder: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const listName = ref('')

    const closeFloatModal = () => {
      emit('closeFloatModal')
    }

    const createNewCollection = () => {
      emit('createNewCollection', listName.value)
    }

    const checkFloatModalItem = (payload: any) => {
      emit('checkFloatModalItem', payload)
    }

    return {
      listName,
      createNewCollection,
      closeFloatModal,
      checkFloatModalItem
    }
  }
})

</script>
