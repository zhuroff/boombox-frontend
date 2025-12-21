<template>
  <div class="tabview">
    <div class="tabview__list">
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

  &__list {
    display: flex;
    border-bottom: 1px solid var.$paleDP;
  }

  &__content {
    padding: var.$basicPadding 0;
  }
}
</style>