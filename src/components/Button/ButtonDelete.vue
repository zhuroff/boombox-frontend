<template>
  
<button
  class="delete"
  @click="deleteItem"
>
  <Sprite name="remove" />
</button>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  name: 'ButtonDelete',

  components: {
    Sprite
  },

  setup(_, { emit }) {
    const deleteItem = () => emit('deleteItem')

    return { deleteItem }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.delete {
  width: 30px;
  height: 30px;
  border: 0;
  background-color: $white;
  border-radius: 50%;
  outline: none;
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;

  .icon-remove {
    width: 20px;
    height: 20px;
  }
}

</style>
