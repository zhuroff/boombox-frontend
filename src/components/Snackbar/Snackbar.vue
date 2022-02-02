<template>
  <div class="snackbar">
    <transition-group name="flyUp">
      <div
        v-for="(item, index) in snackbarItems"
        :key="index"
        class="snackbar__item"
      >
        <div class="snackbar__text">{{ item.message }}</div>
        <button
          :class="`snackbar__action --${item.type}`"
          @click="closeSnackbar(index)"
        >OK</button>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import './Snackbar.scss'

export default defineComponent({
  setup() {
    const store = useStore(key)

    const snackbarItems = computed(() => (
      store.getters.snackbarItems
    ))

    const closeSnackbar = (index: number) => {
      store.commit('closeSnackbar', index)
    }

    return {
      snackbarItems,
      closeSnackbar
    }
  },
})

</script>

