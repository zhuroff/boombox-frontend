<template>
  
<li :class="[{ '--active' : isActive }, 'card']">
  <AppDelete
    v-if="deletable && !isConfirmation"
    @deleteItem="confirmationHandler"
  />

  <div
    v-if="isConfirmation"
    class="card__confirmation"
  >
    <button
      class="card__confirmation_cancel"
      @click="confirmationHandler"
    >Cancel</button>

    <button
      class="card__confirmation_delete"
      @click="deleteItem"
    >Confirm</button>
  </div>
  <slot></slot>
</li>

</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import AppDelete from '~/components/AppDelete.vue'

export default defineComponent({
  components: {
    AppDelete
  },

  props: {
    deletable: {
      type: Boolean,
      required: false,
      default: false
    },

    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup(props, { emit }) {
    const isConfirmation = ref(false)

    const confirmationHandler = () => {
      isConfirmation.value = !isConfirmation.value
    }

    const deleteItem = () => emit('deleteItem')

    return {
      isConfirmation,
      confirmationHandler,
      deleteItem
    }
  }
})

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.card {
  width: 25%;
  margin-bottom: 15px;
  position: relative;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;

  &.--active {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transition: box-shadow 0.3s ease;

    .delete {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }

  &__confirmation {
    position: absolute;
    top: 10px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.35);
    height: 212px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc(100% - 40px);
    border-radius: 5px;
    z-index: 10;

    &_cancel {
      background-color: $white;
      border-color: $white;
      color: $dark;
      margin: 5px 0;
    }

    &_delete {
      background-color: $error;
      border-color: $error;
      margin: 5px 0;
    }
  }
}

</style>
