<template>
  
<li class="applist__list_item">
  <label class="applist__list_item-label">
    <input
      type="checkbox"
      class="--checkbox"
      :checked="isChecked"
      @input="checkAction"
    >
    <span class="--name">{{ item.title }}</span>
  </label>
</li>

</template>

<script>

import { ref } from 'vue'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },

    itemID: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const isChecked = ref(props.item.items.some((el) => el === props.itemID))

    const checkAction = () => {
      isChecked.value = !isChecked.value

      const payload = {
        itemID: props.itemID,
        listID: props.item.id,
        isSave: isChecked.value
      }

      emit('itemAction', payload)
    }

    return {
      isChecked,
      checkAction
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.applist__list {

  &_item {
    margin-bottom: 10px;
    user-select: none;
    padding: 0 25px;
    
    &-label {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 12px;
      color: $pale;

      .--checkbox {
        margin-right: 5px;
      }
    }

    &:first-child {
      padding-top: 25px;
    }

    &:last-child {
      padding-bottom: 0;
    }
  }
}

</style>
