<template>
  <component
    :is="cardElement"
    :to="routePath"
    class="cardlist__item-link"
  >
    <div class="cardlist__item-image">
      <div
        v-if="cardFrame"
        v-html="cardFrame"
        class="cardlist__item-cover --blind"
      />
      <img
        v-else
        :src="cardCover"
        :alt="cardTitle"
        referrerpolicy="no-referrer"
        :class="['cardlist__item-cover', ...coverClasses]"
      />
      <img
        v-if="withVinyl"
        src="/img/vinyl.png"
        alt="vinyl placeholder"
        class="cardlist__item-vinyl"
      />
    </div>
    <div class="cardlist__item-title">
      {{ cardTitle }}
    </div>
    <div
      v-if="cardCaption"
      class="cardlist__item-info"
    >
      {{ cardCaption }}
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  routePath: { path: string }
  cardTitle: string
  cardCover: string
  isRouteLink?: boolean
  cardFrame?: string
  cardCaption?: string
  coverClasses?: string[]
  withVinyl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  withVinyl: true,
  isRouteLink: true,
  coverClasses: () => []
})

const cardElement = computed(() => (
  props.isRouteLink ? 'router-link' : 'div'
))
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.cardlist__item {

  &-link {
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    height: 100%;

    @include var.media('>=desktop') {
      padding: 0 var.$basicPadding;
    }
  }

  &-image {
    object-fit: cover;
    position: relative;
  }

  &-cover,
  &-vinyl {
    width: 100%;
    aspect-ratio: 1;
    display: block;
    transition: transform 0.5s var.$animation;
  }

  &-cover {
    position: relative;
    z-index: 2;
    border-radius: 5px;
    object-fit: cover;

    @include var.media('>=desktop') {
      &:not(.--fixed) {
        &:hover {
          transform: translateX(-#{var.$basicPadding});
          transition: transform 0.3s var.$animation;

          & + .cardlist__item-vinyl {
            transform: translateX(20px);
            transition: transform 0.3s var.$animation;
          }
        }
      }
    }

    &.--rounded {
      border-radius: 50%;
    }

    &.--blind {
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
      }
    }

    iframe {
      border-radius: 5px;
      width: inherit !important;
      height: 100% !important;
      background-color: var.$paleLT;
    }
  }

  &-vinyl {
    @include var.media('<desktop') {
      display: none
    }

    @include var.media('>=desktop') {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
    }
  }

  &-title {

    @include var.media('<desktop') {
      display: none
    }

    @include var.media('>=desktop') {
      @include var.cardHeading();
    }
    }

    &-info {

    @include var.media('<desktop') {
      display: none
    }

    @include var.media('>=desktop') {
      @include var.cardCaption();
    }
  }

  // &__cover {

  //   &_label {
  //     position: relative;
  //     z-index: 1;

  //     .icon {
  //       width: 50px;
  //       height: 50px;
  //       color: var.$white;
  //     }
  //   }
  // }
}
</style>
