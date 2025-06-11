<template>
  <button
    :style="style"
    :type="type"
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
      {{
        Array.isArray(label)
          ? localize(label[0], ...label[1])
          : localize(label)
      }}
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed, type StyleValue } from 'vue'
import { useLocalization } from '~shared/lib'
import { Sprite } from '~shared/UI'

interface Props {
  label?: string | [string, Array<string>]
  icon?: string
  size?: 'small' | 'medium' | 'large'
  style?: StyleValue
  type?: 'button' | 'submit'
  className?: string
  isInverted?: boolean
  isText?: boolean
  isRounded?: boolean
  isDisabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'button',
  isDisabled: false
})

const { localize } = useLocalization()

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

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.button {
  border: 1px solid var.$black;
  color: var.$black;
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
    background-color: var.$black;
    transition: all 0.3s var.$animation;

    &:not(.--text) {
      color: var.$paleLT;
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
    border-color: var.$paleLT;
    color: var.$paleLT;

    &:hover {
      background-color: var.$paleLT;
      color: var.$black;

      .icon {
        fill: var.$dark;
      }
    }

    .icon {
      fill: var.$white;
    }
  }

  &.--text {
    border: 0;
    background-color: transparent;

    &:hover {
      background-color: transparent;
    }

    &.--inverted {
      color: var.$paleLT;

      .icon {
        fill: var.$paleLT;
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
