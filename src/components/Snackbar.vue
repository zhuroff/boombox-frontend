<template>
  <div class="snackbar">
    <transition-group name="flyUp">
      <div
        v-for="([id, item]) in snackbarQueue"
        :key="id"
        class="snackbar__item"
      >
        <div class="snackbar__text" v-html="item.message" />
        <button
          :class="`snackbar__action --${item.type}`"
          @click="() => closeSnackbar(id)"
        >OK</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import useSnackbar from '~/hooks/useSnackbar'

const { snackbarQueue, closeSnackbar } = useSnackbar()
</script>

<style lang="scss" scoped>
@use '~/scss/variables' as var;

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
    background-color: var.$black;
    padding: 15px 20px;
    border-radius: 7px;
    margin-top: 10px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.4);
  }

  &__text {
    color: var.$white;
    margin-right: 15px;
  }

  &__action {
    background-color: transparent;
    border: 0;
    font-size: 16px;

    &.--success {
      color: var.$success;
    }

    &.--warning {
      color: var.$warning;
    }

    &.--error {
      color: var.$error;
    }

    &.--info {
      color: var.$info;
    }
  }
}
</style>
