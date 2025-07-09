<template>
  <li class="toy-year__card">
    <router-link
      class="toy-year__card-link"
      :to="{ path: `/${rootPath}/${card.title}` }"
    >
      <span>{{ card.title }}</span>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import type { CloudEntity } from '~shared/lib'

interface Props {
  card: CloudEntity
  rootPath: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.toy-year__card {
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

    .toy-year__card-link {
      color: var.$black;
      transition: color 0.5s var.$animation;
    }
  }
}
</style>
