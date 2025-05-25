<template>
  <li class="toy-genre__card">
    <router-link
      class="toy-genre__card-link"
      :to="{ path: `/${rootPath}/${card.path}` }"
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
@use '~/scss/variables' as var;

.toy-genre__card {
  border-radius: var.$borderRadiusMD;
  background-color: var.$black;
  border: 1px solid var.$black;
  position: relative;
  overflow: hidden;
  min-height: 6rem;

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
    @include var.serif(2.5rem);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    color: var.$paleLT;
    height: 100%;
    z-index: 10;
    transition: color 0.5s var.$animation;

    span {
      transition: transform 0.5s var.$animation;
    }

    &:after {
      content: '';
      position: absolute;
      height: 2px;
      width: 10rem;
      max-width: 0;
      border-radius: 50%;
      left: 50%;
      transform: translate(-50%, 1500%);
      transition: max-width 0.5s var.$animation;
      background-image: linear-gradient(to right, rgba(15,30,54,0), var.$black, rgba(15,30,54,0))
    }
  }

  &:hover {
    &:before {
      max-height: 100%;
      transition: max-height 0.5s var.$animation;
    }

    .toy-genre__card-link {
      color: var.$black;
      transition: color 0.5s var.$animation;

      span {
        transform: translateY(-0.5rem);
        transition: transform 0.5s var.$animation;
      }

      &:after {
        max-width: 10rem;
        transition: max-width 0.75s var.$animation 0.2s;
      }
    }
  }
}
</style>
