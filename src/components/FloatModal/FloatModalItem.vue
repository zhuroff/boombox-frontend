<template>
  
<li class="float-modal__item">
  <label>
    <input
      type="checkbox"
      class="--checkbox"
      :checked="isChecked"
      @change="checkFloatModalItem"
    >
    <span class="--name">{{ item.title }}</span>
  </label>
</li>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import { IFloatModalCheckAction } from '~/types/Global'

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true
    },

    itemID: {
      type: String,
      required: true
    },

    isChecked: {
      type: Boolean,
      required: false,
      frfault: false
    }
  },

  setup(props, { emit }) {

    const checkFloatModalItem = () => {
      const payload: IFloatModalCheckAction = {
        itemID: props.itemID,
        listID: props.item._id,
        inList: props.isChecked
      }

      emit('checkFloatModalItem', payload)
    }

    return {
      checkFloatModalItem
    }
  }
})

</script>
