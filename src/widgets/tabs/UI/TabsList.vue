<template>
  <div class="tabview">
    <div class="tabview__tabs">
      <TabListItem
        v-for="item in items"
        :key="String(item.id)"
        :item="item"
        :isActive="activeTabId === item.id"
        :renderTitle="renderTitle"
      />
    </div>
    <div class="tabview__content">
      <component
        v-if="activeTabData"
        :is="renderContent(activeTabData)"
      />
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, type VNode } from 'vue'
import TabListItem from './TabListItem.vue'

type Props = {
  items: T[]
  activeTabId: number | string | null
  renderTitle: (item: T) => VNode
  renderContent: (item: T) => VNode
}

const props = defineProps<Props>()

const activeTabData = computed(() => (
  props.items.find((item) => item.id === props.activeTabId)
))
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.tabview {

  &__tabs {
    display: flex;
    border-bottom: 1px solid var.$paleDP;
    position: sticky;

    @include var.media('<desktop') {
      top: 0;
      background-color: var.$black;
    }

    @include var.media('>=desktop') {
      top: var.$desktopHeaderHeight;
      background-color: var.$paleLT;
    }
  }

  &__content {
    padding: var.$minPadding 0;
  }
}
</style>