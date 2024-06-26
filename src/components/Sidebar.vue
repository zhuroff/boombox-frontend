<template>
  <aside :class="[{ '--opened': isExpanded }, 'aside']">
    <!-- <ButtonBurger
      :isActive="isExpanded"
      @burgerClick="burgerClick"
    /> -->
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

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import router from '~/router'
// import ButtonBurger from '~/components/Button/ButtonBurger.vue'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    // ButtonBurger,
    Sprite
  },
  props: {
    isExpanded: {
      type: Boolean,
      required: true
    },
  },
  setup(_, { emit }) {
    const { lang } = useLocales()
    const burgerClick = () => emit('burgerClick')

    const navbar = computed(() => (
      router
        .getRoutes()
        .filter(({ meta }) => meta?.navLocaleKey)
        .map(({ meta, path }) => ({
          title: lang(`navigation.${meta.navLocaleKey as string}`),
          route: path.replace('/', '')
        }))
    ))

    return {
      navbar,
      burgerClick,
      lang
    }
  }
})
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.aside {
  flex: none;
  background-color: $white;
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
    // border-right: 1px solid $paleLT;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    position: relative;
    width: $asideWidth;
  }

  &.--z-low {
    z-index: 1000;
  }

  &__homelink {
    display: flex;
    align-items: center;
    font-size: 1.15rem;
    padding: 0 25px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;

    @include media('<laptop') {
      justify-content: flex-end;
      height: 50px;
      color: $white;
    }

    @include media('>=laptop') {
      height: 70px;
      color: $paleDP;
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
      padding: 0 25px;
      transition: all 0.2s ease;

      @include media('<laptop') {
        text-align: right;
        color: $white;
      }

      @include media('>=laptop') {
        color: $white;
      }

      &:hover,
      &.router-link-active {
        transition: all 0.2s ease;
        background-color: $white;
        color: $dark;
      }
    }
  }
}
</style>
