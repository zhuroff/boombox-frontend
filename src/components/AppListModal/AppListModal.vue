<template>
  
<div class="applist__modal">
  <ul class="applist__list">
    <AppListModalItem
      v-for="item in filteredData"
      :key="item._id"
      :item="item"
      :itemID="itemID"
      @itemAction="itemAction"
    />
  </ul>

  <form
    class="applist__list-create"
    @submit.prevent="createNewList"
  >
    <input
      type="text"
      class="--title"
      :placeholder="placeholder"
      v-model="listName"
    >

    <button
      class="--submit"
      type="submit"
      :disabled="!listName.length"
    >
      <span>OK</span>
    </button>
  </form>
</div>

</template>

<script>

import {
  ref, computed, onMounted, onBeforeUnmount
} from 'vue'
import AppListModalItem from './AppListModalItem.vue'

export default {
  components: {
    AppListModalItem
  },

  props: {
    data: {
      type: Array,
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

    const onClickOutside = ($event) => {
      if (
        $event.target.offsetParent
        && $event.target.offsetParent.className !== 'applist__modal'
      ) emit('closeListModal')
    }

    onMounted(() => {
      document.addEventListener('click', onClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside)
    })

    const filteredData = computed(() => (
      props.data.filter((el) => !el.preloader)
    ))

    const createNewList = () => {
      emit('createNewList', listName.value)
    }

    const itemAction = (payload) => {
      emit('itemAction', payload)
    }

    return {
      listName,
      filteredData,
      createNewList,
      itemAction
    }
  }
}

</script>

<style lang="scss" scoped>

@import '@/scss/variables';

.applist__modal {
  position: absolute;
  min-width: 100px;
  right: 0;
  top: 100%;
  background: $white;
  z-index: 10;
  border-radius: 3px;
  cursor: default;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.applist__list-create {
  display: flex;
  align-items: center;
  padding: 10px 25px 25px;
  margin-top: auto;

  .--title {
    height: 30px;
    border-radius: 3px;
    background-color: $white;
    flex: 1 1 0;
    padding: 0 10px;
    border: 1px solid $border;
    outline: none;
  }

  .--submit {
    height: 30px;
    width: 30px;
    margin-left: 5px;
    border-radius: 3px;
    background-color: $dark;
    color: $white;
    border: 0;
    outline: none;
    cursor: pointer;

    &[disabled] {
      opacity: 0.25;
      cursor: default;
      pointer-events: none;
    }
  }
}

</style>
