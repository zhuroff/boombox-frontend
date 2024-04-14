<template>
  <button
    :class="[
      'button',
      {
        '--outlined': isOutlined,
        '--inverted': isInverted,
        '--rounded': isRounded,
        '--active': isActive,
        '--text': isText
      },
      `--${size}`,
      className
    ]"
    :disabled="isDisabled"
  >
    <span
      v-if="label"
      class="button__label">{{ label }}
    </span>
    <slot></slot>
    <Sprite
      v-if="icon"
      :name="icon"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    className: {
      type: String,
      required: false,
      default: false
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    isOutlined: {
      type: Boolean,
      required: false,
      default: false
    },
    isText: {
      type: Boolean,
      required: false,
      default: false
    },
    isInverted: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
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

  &.--rounded {
    border-radius: 50%;
  }

  &.--inverted {
    border-color: $paleDP;
    color: $paleDP;
    transition: all 0.2s $animation;

    &:hover {
      border-color: $white;
      color: $white;
      transition: all 0.2s $animation;

      .icon {
        fill: $white;
      }
    }

    .icon {
      fill: $paleDP;
    }
  }

  &.--text {
    background-color: transparent;
    border-color: transparent !important;

    &:hover {
      color: $paleDP;
      transition: all 0.2s $animation;
    }
  }

  &.--small {
    font-size: .75rem;
    width: 30px;

    &.--rounded {
      height: 30px;
    }

    .button__label {

       & + .icon {
        margin-left: 3px;
       }
    }

    .icon {
      width: 1rem;
    }
  }

  &.--medium {
    font-size: .875rem;
    height: 36px;

    &.--rounded {
      width: 36px;
    }

    .button__label {
      
      & + .icon {
       margin-left: 5px;
      }
    }

    .icon {
      width: 1.25rem;
    }
  }

  &.--large {
    font-size: 1rem;
    height: 42px;

    &.--rounded {
      width: 42px;
    }

    .button__label {
      
      & + .icon {
       margin-left: 10px;
      }
   }

    .icon {
      width: 1.75rem;
    }
  }

  &:not(.--outlined):not(.--text):not(.--inverted) {
    border-color: $dark;
    background-color: $dark;
    color: $white;
    transition: all 0.2s $animation;

    &:hover {
      background-color: $warning;
      color: $black;
      transition: all 0.2s $animation;
    }
  }

  &.--active {
    background-color: $warning !important;
    color: $black !important;
  }

  &.--outlined.--text {
    background-color: transparent;
    border-color: transparent;
  }

  &[disabled] {
    pointer-events: none;
    cursor: default;
    opacity: 0.5;
  }

  &__label {
    white-space: nowrap;
  }
}
</style>
