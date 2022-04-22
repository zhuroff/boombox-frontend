<template> 
  <li :class="[{ '--active' : isActive }, 'card']">
    <ButtonDelete
      v-if="deletable && !isConfirmation"
      @deleteItem="confirmationHandler"
    />

    <span
      v-if="draggable"
      class="--drag"
    >
      <Sprite name="burger" />
    </span>

    <div
      v-if="isConfirmation"
      class="card__confirmation"
    >
      <Button
        text="Cancel"
        @onClick="confirmationHandler"
      />

      <Button
        text="Confirm"
        isOutlined
        @onClick="deleteItem"
      />
    </div>
    <slot></slot>
  </li>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import ButtonDelete from '~/components/Button/ButtonDelete.vue'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from '~/components/Button/Button.vue'

export default defineComponent({
  name: 'CardWrapper',

  components: {
    ButtonDelete,
    Sprite,
    Button
  },

  props: {
    deletable: {
      type: Boolean,
      required: false,
      default: false
    },

    draggable: {
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

  setup(_, { emit }) {
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
  border-radius: 5px;
  padding: 10px;
  transition: all 0.3s ease;

  &.--active {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  &.sortable-chosen {
    background-color: $border;
  }

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    transition: box-shadow 0.3s ease;

    .delete {
      opacity: 1;
      transition: opacity 0.3s ease;
    }

    .--drag {
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

    .button {
      margin: 5px 0;
    }
  }

  .--drag {
    width: 30px;
    height: 30px;
    cursor: move;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;

    .icon {
      width: 18px;
    }
  }
}

</style>
