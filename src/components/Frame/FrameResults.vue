<template>

<ul class="form-frame__results">
  <li
    v-for="item in items"
    :key="item._id"
    class="form-frame__result"
    @click="selectCategory(item)"
  >
    <img
      :src="host(item.avatar)"
      :alt="item.title"
      class="form-frame__avatar"
    >
    <span class="form-frame__title">{{ item.title }}</span>
  </li>
</ul>

</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'
import { hostString } from '~/shared/media'
import { CategorySearchResult } from '~/types/Category'

export default defineComponent({
  name: 'FrameResults',

  props: {
    items: {
      type: Array as PropType<CategorySearchResult[]>
    },

    defaultAvatar: {
      type: String
    }
  },

  setup(props, { emit }) {
    const selectCategory = (item: CategorySearchResult) => {
      emit('selectCategory', item)
    }

    const host = (pathname: string) => {
      return pathname
        ? hostString(pathname)
        : `/img/${props.defaultAvatar}.jpg`
    }

    return {
      selectCategory,
      host
    }
  },
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.form-frame {

  &__result {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 5px;
    border-radius: 3px;
    transition: background-color 0.3s $animation;

    &:hover {
      background-color: $border;
      transition: background-color 0.3s $animation;
    }
  }

  &__avatar {
    width: 35px;
    height: 35px;
    object-fit: cover;
    border-radius: 3px;
    margin-right: 10px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
  }
}

</style>
