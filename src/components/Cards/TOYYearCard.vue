<template>
  <li class="card__toy">
    <router-link
      class="card__toy-link"
      :to="{ path: `/${rootPath}/${card.title}` }"
    >
      <span>{{ card.title }}</span>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import type { CloudEntity } from '~/types/ReqRes'

interface Props {
  card: CloudEntity
  rootPath: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use  '~/scss/variables' as var;

.card__toy {
  border-radius: var.$borderRadiusSM;
  background-color: var.$black;
  border: 1px solid var.$black;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    background-color: var.$paleLT;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 0;
    transition: max-height 0.5s var.$animation;
  }
  
  &-link {
    color:var.$paleLT;
    display: flex;
    padding: 0.75rem 1rem;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    position: relative;
    z-index: 10;
    transition: color 0.5s var.$animation;
  }

  &:hover {
    &:before {
      max-height: 100%;
      transition: max-height 0.5s var.$animation;
    }

    .card__toy-link {
      color: $black;
      transition: color 0.5s var.$animation;
    }
  }
}
</style>
