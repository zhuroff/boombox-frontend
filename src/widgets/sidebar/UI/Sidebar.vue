<template>
  <aside :class="[{ '--top-aligned': isTopAligned }, 'aside']">
    <router-link
      class="aside__homelink"
      to="/"
    >
      <Sprite name="vinyl" />
      <span>MelodyMap</span>
    </router-link>
    <nav class="aside__nav">
      <ul class="aside__nav-list">
        <li
          v-if="isMobile"
          class="aside__nav-item"
        >
          <router-link
            to="/"
            class="aside__nav-link"
          >
            <Sprite name="home" />
          </router-link>
        </li>
        <li
          v-for="(item, index) in navbar"
          :key="index"
          class="aside__nav-item"
        >
          <router-link
            :to="`/${item.route}`"
            class="aside__nav-link"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDevice } from '~shared/model'
import { Sprite } from '~shared/UI'
import { useLocalization } from '~shared/model'

const router = useRouter()
const { isMobile } = useDevice()
const { localize } = useLocalization()

const mobileNavbarTopSections = new Set([
  'album-single-page',
  'embedded-single-page',
  'compilation-single-page',
  'collection-single-page',
  'artist-single-page',
  'genre-single-page',
  'period-single-page'
])

const navbar = computed(() => {
  return router
    .getRoutes()
    .filter(({ meta }) => (
      meta?.navLocaleKey && (!isMobile.value || meta.navLocaleKey !== 'settings')
    ))
    .map(({ meta, path }) => ({
      title: localize(`navigation.${meta.navLocaleKey as string}`),
      route: path.replace('/', '')
    }))
})

const isTopAligned = computed(() => (
  isMobile.value &&
  mobileNavbarTopSections.has(String(router.currentRoute.value.name))
))
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.aside {
  flex: none;
  z-index: 2000;
  overflow: auto;

  @include var.media('<desktop') {
    position: absolute;
    top: 54px;
    left: 0;
    width: 100vw;
    overflow: auto;
    z-index: 9100;
    background-color: var.$black;

    &.--top-aligned {
      top: 0;
      position: fixed;
    }
  }

  @include var.media('>=desktop') {
    position: relative;
    width: var.$asideWidth;
    background-color: var.$dark;
  }

  &.--z-low {
    z-index: 1000;
  }

  &__homelink {
    display: flex;
    align-items: center;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;

    @include var.media('<desktop') {
      display: none;
    }

    @include var.media('>=desktop') {
      height: 70px;
      padding: 0 var.$mainPadding;
      font-size: 1.15rem;
      color: var.$paleMD;
    }

    .icon-vinyl {

      @include var.media('<desktop') {
        display: none;
      }

      @include var.media('>=desktop') {
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

    @include var.media('<desktop') {
      display: flex;
    }

    &-list {
      @include var.media('<desktop') {
        display: flex;
        margin: 0 auto;
      }
    }

    &-item {
      @include var.media('<desktop') {
        padding: 0 0.5rem;

        &:first-of-type {
          padding-left: 1rem;
        }

        &:last-of-type {
          padding-right: 1rem;
        }
      }
    }

    &-link {
      display: block;
      transition: all 0.2s ease;
      line-height: 3;

      @include var.media('<desktop') {
        text-align: right;
        color: var.$paleMD;
        font-size: 0.875rem;
        line-height: 4;

        &.router-link-active {
          color: var.$warning;

          .icon {
            fill: var.$warning;
          }
        }

        .icon {
          width: 20px;
          fill: var.$paleMD;
          position: relative;
          top: -2px;
        }
      }

      @include var.media('>=desktop') {
        color: var.$white;
        padding: 0 var.$mainPadding;

        &:hover,
        &.router-link-active {
          transition: all 0.2s ease;
          background-color: var.$paleLT;
          color: var.$dark;
        }
      }
    }
  }
}
</style>
