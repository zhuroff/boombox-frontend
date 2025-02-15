<template>
  <button
    :style="style"
    :type="type"
    :class="stateClasses"
  >
    <Sprite
      v-if="icon"
      :name="icon"
    />
    <span
      v-if="label"
      class="button__label"
    >{{ localize(label) }}</span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import useGlobalStore from '~/store/global'
import Sprite from '~/components/Sprite/Sprite.vue'

interface Props {
  label?: string
  icon?: string
  size?: 'small' | 'medium' | 'large'
  style?: StyleValue
  type?: 'button' | 'submit'
  className?: string
  isInverted?: boolean
  isText?: boolean
  isRounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'button'
})

const {
  globalGetters: { localize }
} = useGlobalStore()

const stateClasses = computed(() => [
  'button',
  {
    '--inverted': props.isInverted,
    '--rounded': props.isRounded,
    '--text': props.isText
  },
  `--${props.size}`,
  props.className,
])
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.button {
  border: 1px solid $black;
  color: $black;
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  padding-top: 0;
  padding-bottom: 0;
  transition: all 0.3s $animation;

  &:hover {
    background-color: $black;
    transition: all 0.3s $animation;

    &:not(.--text) {
      color: $paleLT;
    }
  }

  &.--small {

    &.--rounded {
      width: $elementHeightSM;
    }

    .icon {
      width: 1rem;

      & + .button__label {
        margin-left: 3px;
      }
    }
  }

  &.--medium {

    &.--rounded {
      width: $elementHeightMD;
    }

    .icon {
      width: 1.25rem;

      & + .button__label {
        margin-left: 5px;
      }
    }
  }

  &.--large {

    &.--rounded {
      width: $elementHeightLG;
    }

    .icon {
      width: 1.75rem;

      & + .button__label {
        margin-left: 10px;
      }
    }
  }

  &.--rounded {
    border-radius: 50%;
    padding: 0 !important;
  }

  &.--inverted {
    border-color: $paleLT;
    color: $paleLT;

    &:hover {
      background-color: $paleLT;
      color: $black;

      .icon {
        fill: $dark;
      }
    }

    .icon {
      fill: $white;
    }
  }

  &.--text {
    border: 0;
    background-color: transparent;

    &:hover {
      background-color: transparent;
    }

    &.--inverted {
      color: $paleLT;

      .icon {
        fill: $paleLT;
      }
    }
  }

  &__label {
    display: block;
    margin: 0 .75rem;
  }

  &[disabled] {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }
}
</style>
