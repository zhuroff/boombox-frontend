<template>
  <div class="snackbar">
    <transition-group name="flyUp">
      <div
        v-for="(item, index) in snackbarItems"
        :key="index"
        class="snackbar__item"
      >
        <div class="snackbar__text" v-html="item.message" />
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

<style lang="scss">
@import '~/scss/variables';

.snackbar {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 400px;
  z-index: 9999;
  letter-spacing: 0.3px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: $black;
    padding: 15px 20px;
    border-radius: 7px;
    margin-top: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.4);
  }

  &__text {
    color: $white;
    margin-right: 15px;
  }

  &__action {
    background-color: transparent;
    border: 0;
    font-size: 16px;

    &.--success {
      color: $success;
    }

    &.--warning {
      color: $warning;
    }

    &.--error {
      color: $error;
    }

    &.--info {
      color: $info;
    }
  }
}
</style>
