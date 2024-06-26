<template>
  <button
    :style="style"
    :class="[
      'button',
      {
        '--inverted': isInverted,
        '--rounded': isRounded,
        '--text': isText
      },
      `--${size}`,
      className,
    ]"
  >
    <Sprite
      v-if="icon"
      :name="icon"
    />
    <span
      v-if="label"
      class="button__label">{{ label }}
    </span>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { PropType, StyleValue, defineComponent } from 'vue'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  name: 'Button',
  components: {
    Sprite
  },
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    icon: {
      type: String,
      required: false
    },
    size: {
      type: String,
      required: false,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    style: {
      type: Object as PropType<StyleValue>,
      required: false
    },
    className: {
      type: String,
      required: false,
      default: false
    },
    isInverted: {
      type: Boolean,
      required: false,
      default: false
    },
    isText: {
      type: Boolean,
      required: false,
      default: false
    },
    isRounded: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.button {
  border-radius: $borderRadiusSM;
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
    font-size: .625rem;
    height: $inputSizeSM;
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    &.--rounded {
      width: $inputSizeSM;
    }

    .icon {
      width: 1rem;

      & + .button__label {
        margin-left: 3px;
      }
    }
  }

  &.--medium {
    font-size: .75rem;
    height: $inputSizeMD;
    padding-left: 1rem;
    padding-right: 1rem;

    &.--rounded {
      width: $inputSizeMD;
    }

    .icon {
      width: 1.25rem;

      & + .button__label {
        margin-left: 5px;
      }
    }
  }

  &.--large {
    font-size: 1rem;
    height: $inputSizeLG;
    padding-left: 1.25rem;
    padding-right: 1.25rem;

    &.--rounded {
      width: $inputSizeLG;
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

  &[disabled] {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }
}
</style>
