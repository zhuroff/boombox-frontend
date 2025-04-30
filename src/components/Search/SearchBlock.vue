<template>
  <div class="search__block">
    <div
      v-f="!!heading"
      class="search__block-title"
    >{{ heading }}</div>
    <ul class="search__block-list">
      <li
        v-for="item in block.data"
        :key="item._id"
        class="search__block-item"
      >
        <component :is="renderer(block.key, item)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { RendererElement, RendererNode, VNode } from 'vue'

interface Props {
  block: SearchBlock
  heading?: string
  renderer: (key: string, data: SearchResultData) => (
    VNode<RendererNode, RendererElement, {
      [key: string]: any
    }>
  )
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '~/scss/variables' as var;

.search__block {
  padding: 0.75rem 0;

  &:first-of-type {
    padding-top: 0;
  }

  &:last-of-type {
    padding-bottom: 0;
    border-bottom: 0;
  }

  &-title {
    @include var.serif(1rem);
    margin-bottom: 5px;
    padding: 0 5px;
  }

  &-action {
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    transition: background-color 0.3s var.$animation;

    &:hover {
      background-color: var.$paleLT;
      transition: background-color 0.3s var.$animation;
    }

    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: var.$borderRadiusSM;
      max-height: 100%;
      display: block;
      margin-right: 0.875rem;
    }

    strong {
      color: var.$black;
      display: block;
    }

    span {
      font-size: 0.875rem;
      color: var.$paleDP;
    }

    .icon {
      width: 24px;
      margin-left: auto;
      color: var.$paleDP;

      &.--active {
        fill: var.$success;
      }
    }
  }
}
</style>
