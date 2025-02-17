<template>
  <aside :class="[{ '--opened': isExpanded }, 'aside']">
    <Button
      className="aside__burger"
      :icon="isExpanded ? 'close' : 'burger'"
      isText
      @click="burgerClick"
    />
    <router-link
      class="aside__homelink"
      to="/"
      @click="burgerClick"
    >
      <Sprite name="vinyl" />
      <span>MelodyMap</span>
    </router-link>
    <nav class="aside__nav">
      <ul class="aside__nav-list">
        <li
          v-for="(item, index) in navbar"
          :key="index"
          class="aside__nav-item"
        >
          <router-link
            :to="`/${item.route}`"
            class="aside__nav-link"
            @click="burgerClick"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useGlobalStore from '~/store/global'
import router from '~/router'
import Sprite from '~/components/Sprite/Sprite.vue'
import Button from './Button.vue'

interface Props {
  isExpanded: boolean
}

interface Emits {
  (e: 'burgerClick'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const burgerClick = () => emit('burgerClick')

const navbar = computed(() => (
  router
    .getRoutes()
    .filter(({ meta }) => meta?.navLocaleKey)
    .map(({ meta, path }) => ({
      title: localize(`navigation.${meta.navLocaleKey as string}`),
      route: path.replace('/', '')
    }))
))
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.aside {
  flex: none;
  z-index: 2000;
  background-color: $dark;
  overflow: auto;

  @include media('<laptop') {
    position: relative;
    width: $asideWidthMobile;
    height: 100vh;
    top: 0;
    right: 0;
    padding-top: 50px;
    transition: transform 0.75s $animation;
    background-color: $accent;
    order: 1;

    &.--opened {
      transform: translateX(-#{$asideWidthMobile});
      transition: transform 0.5s $animation;
    }
  }

  @include media('>=laptop') {
    position: relative;
    width: $asideWidth;
  }

  &.--z-low {
    z-index: 1000;
  }

  &__burger {
    
    @include media('<laptop') {
      position: fixed;
      top: 1rem;
      right: 1rem;
      padding: 0 !important;

      .icon {
        width: 2rem !important;
        fill: $white;
        color: $white;
      }
    }

    @include media('>=laptop') {
      display: none;
    }
  }

  &__homelink {
    display: flex;
    align-items: center;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;

    @include media('<laptop') {
      justify-content: flex-start;
      height: 50px;
      padding: 0 1rem;
      font-size: 1rem;
      color: $white;
    }

    @include media('>=laptop') {
      height: 70px;
      padding: 0 25px;
      font-size: 1.15rem;
      color: $paleMD;
    }

    .icon-vinyl {

      @include media('<laptop') {
        display: none;
      }

      @include media('>=laptop') {
        width: 24px;
        height: 24px;
        margin-right: 0.5rem;
        flex: none;
        fill: $paleDP;
        stroke: $paleDP;
      }
    }
  }

  &__nav {

    &-link {
      line-height: 3;
      display: block;
      transition: all 0.2s ease;

      @include media('<laptop') {
        text-align: right;
        color: $white;
        padding: 0 1rem;
      }

      @include media('>=laptop') {
        color: $white;
        padding: 0 $mainPadding;
      }

      &:hover,
      &.router-link-active {
        transition: all 0.2s ease;
        // background-color: $white;
        background-color: $paleLT;
        color: $dark;
      }
    }
  }
}
</style>
