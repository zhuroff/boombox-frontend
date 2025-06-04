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
import { useRouter } from 'vue-router'
import { Button, Sprite } from '~shared/UI'
import { useTranslate } from '~usecases/localization'

interface Props {
  isExpanded: boolean
}

interface Emits {
  (e: 'burgerClick'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useTranslate()

const router = useRouter()

const burgerClick = () => emit('burgerClick')

const navbar = computed(() => {
  return router
    .getRoutes()
    .filter(({ meta }) => meta?.navLocaleKey)
    .map(({ meta, path }) => ({
      title: localize(`navigation.${meta.navLocaleKey as string}`),
      route: path.replace('/', '')
    }))
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.aside {
  flex: none;
  z-index: 2000;
  background-color: var.$dark;
  overflow: auto;

  @include var.media('<laptop') {
    position: relative;
    width: var.$asideWidthMobile;
    height: 100vh;
    top: 0;
    right: 0;
    padding-top: 50px;
    transition: transform 0.75s var.$animation;
    background-color: var.$accent;
    order: 1;

    &.--opened {
      transform: translateX(-#{var.$asideWidthMobile});
      transition: transform 0.5s var.$animation;
    }
  }

  @include var.media('>=laptop') {
    position: relative;
    width: var.$asideWidth;
  }

  &.--z-low {
    z-index: 1000;
  }

  &__burger {
    
    @include var.media('<laptop') {
      position: fixed;
      top: 1rem;
      right: 1rem;
      padding: 0 !important;

      .icon {
        width: 2rem !important;
        fill: var.$white;
        color: var.$white;
      }
    }

    @include var.media('>=laptop') {
      display: none !important;
    }
  }

  &__homelink {
    display: flex;
    align-items: center;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;

    @include var.media('<laptop') {
      justify-content: flex-start;
      height: 50px;
      padding: 0 1rem;
      font-size: 1rem;
      color: var.$white;
    }

    @include var.media('>=laptop') {
      height: 70px;
      padding: 0 25px;
      font-size: 1.15rem;
      color: var.$paleMD;
    }

    .icon-vinyl {

      @include var.media('<laptop') {
        display: none;
      }

      @include var.media('>=laptop') {
        width: 24px;
        height: 24px;
        margin-right: 0.5rem;
        flex: none;
        fill: var.$paleDP;
        stroke: var.$paleDP;
      }
    }
  }

  &__nav {

    &-link {
      line-height: 3;
      display: block;
      transition: all 0.2s ease;

      @include var.media('<laptop') {
        text-align: right;
        color: var.$white;
        padding: 0 1rem;
      }

      @include var.media('>=laptop') {
        color: var.$white;
        padding: 0 var.$mainPadding;
      }

      &:hover,
      &.router-link-active {
        transition: all 0.2s ease;
        background-color: var.$paleLT;
        color: var.$dark;
      }
    }
  }
}
</style>
