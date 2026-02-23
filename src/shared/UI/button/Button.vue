<template>
  <button
    :style="style"
    :type="type"
    :title="title"
    :class="stateClasses"
    :disabled="isDisabled"
  >
    <Sprite
      v-if="icon"
      :name="icon"
    />
    <span
      v-if="label"
      class="button__label"
    >
      {{ label }}
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import { Sprite } from '~shared/UI'

interface Props {
  label?: string
  icon?: string
  size?: 'small' | 'medium' | 'large'
  style?: StyleValue
  title?: string
  type?: 'button' | 'submit'
  className?: string
  isInverted?: boolean
  isBorderless?: boolean
  isText?: boolean
  isRounded?: boolean
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'button',
  isDisabled: false
})

const stateClasses = computed(() => [
  'button',
  {
    '--inverted': props.isInverted,
    '--rounded': props.isRounded,
    '--text': props.isText,
    '--borderless': props.isBorderless
  },
  `--${props.size}`,
  props.className,
])
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.button {
  border: 1px solid var.$dark;
  color: var.$dark;
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  padding-top: 0;
  padding-bottom: 0;
  transition: all 0.3s var.$animation;

  &:hover {
    background-color: var.$dark;
    transition: all 0.3s var.$animation;

    &:not(.--text) {
      color: var.$light;
    }
  }

  &.--small {

    &.--rounded {
      width: var.$elementHeightSM;
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
      width: var.$elementHeightMD;
    }

    .icon {
      width: 1.25rem;

      & + .button__label {
        margin-left: var.$fieldPadding;
      }
    }
  }

  &.--large {

    &.--rounded {
      width: var.$elementHeightLG;
    }

    .icon {
      width: 1.75rem;

      & + .button__label {
        margin-left: var.$basicPadding;
      }
    }
  }

  &.--rounded {
    border-radius: 50%;
    padding: 0 !important;
  }

  &.--inverted {
    border-color: var.$light;
    color: var.$light;

    &:hover {
      background-color: var.$light;
      color: var.$dark;

      .icon {
        fill: var.$dark;
      }
    }

    .icon {
      fill: var.$light;
    }
  }

  &.--text {
    border: 0;
    background-color: transparent;

    &:hover {
      background-color: transparent;
    }

    &.--inverted {
      color: var.$light;

      .icon {
        fill: var.$light;
      }
    }

    .button__label {
      margin: 0;
    }
  }

  &.--borderless {
    border: 0;

    &:hover {
      background-color: var.$dark;

      .icon {
        fill: var.$light;
      }
    }
  }

  &__label {
    display: block;
    margin: 0 .75rem;
    white-space: nowrap;
  }

  &[disabled] {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }
}
</style>
