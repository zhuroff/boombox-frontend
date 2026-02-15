<template>
  <div :class="['tabs__item', { '--active': isActive }]">
    <component :is="renderTitle(item)" />
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { VNode } from 'vue'

type Props = {
  item: T
  isActive: boolean
  renderTitle: (item: T) => VNode
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.tabs {
  
  &__item {
    position: relative;
    padding-left: var.$fieldPadding;
    padding-right: var.$fieldPadding;

    .button {
      color: var.$paleDP;
    }
    
    &.--active {
      color: var.$info;

      .button {
        color: var.$info;
      }

      &:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: var.$info;
        border-top-left-radius: var.$borderRadiusSM;
        border-top-right-radius: var.$borderRadiusSM;
      }
    }
  }
}
</style>
