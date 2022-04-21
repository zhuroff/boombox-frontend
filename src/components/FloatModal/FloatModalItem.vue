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

import { defineComponent, PropType } from 'vue'
import { CollectionListItem } from '~/types/Collection'
import { FloatModalCheckAction } from '~/types/Global'
import { PlayListItem } from '~/types/Playlist'

export default defineComponent({
  name: 'FloatModalItem',

  props: {
    item: {
      type: Object as PropType<CollectionListItem | PlayListItem>,
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
      const payload: FloatModalCheckAction = {
        itemID: props.itemID,
        listID: props.item._id,
        inList: props.isChecked,
        order: 0
      }

      emit('checkFloatModalItem', payload)
    }

    return {
      checkFloatModalItem
    }
  }
})

</script>
