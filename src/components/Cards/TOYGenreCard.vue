<template>
  <li class="card__toy">
    <router-link
      class="card__toy-link"
      :to="{ path: `/${rootPath}/${slugify(card.path)}` }"
    >
      <span>{{ card.title }}</span>
    </router-link>
  </li>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { CloudEntity } from '~/types/ReqRes'
import { slugify } from '~/utils'

export default defineComponent({
  name: 'TOYGenreCard',
  props: {
    card: {
      type: Object as PropType<CloudEntity>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      slugify
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.card__toy {
  border-radius: $borderRadiusMD;
  background-color: $black;
  border: 1px solid $black;
  position: relative;
  overflow: hidden;
  min-height: 6rem;

  &:before {
    content: '';
    background-color: $paleLT;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 0;
    transition: max-height 0.5s $animation;
  }

  &-link {
    @include serif(2.5rem, 400);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    color: $paleLT;
    height: 100%;
    z-index: 10;
    transition: color 0.5s $animation;

    span {
      transition: transform 0.5s $animation;
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
      transition: max-width 0.5s $animation;
      background-image: linear-gradient(to right, rgba(15,30,54,0), $black, rgba(15,30,54,0))
    }
  }

  &:hover {
    &:before {
      max-height: 100%;
      transition: max-height 0.5s $animation;
    }

    .card__toy-link {
      color: $black;
      transition: color 0.5s $animation;

      span {
        transform: translateY(-0.5rem);
        transition: transform 0.5s $animation;
      }

      &:after {
        max-width: 10rem;
        transition: max-width 0.75s $animation 0.2s;
      }
    }
  }
}
</style>
