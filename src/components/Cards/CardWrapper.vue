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
    <slot />
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

    savable: {
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
