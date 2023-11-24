<template>
  <button
    :class="[
      'button',
      {
        '--outlined': isOutlined,
        '--inverted': isInverted,
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

  &.--inverted {
    border-color: $paleDP;
    color: $paleDP;
    transition: all 0.2s $animation;

    &:hover {
      border-color: $white;
      color: $white;
      transition: all 0.2s $animation;
    }
  }

  &.--text {
    background-color: transparent;
    border-color: transparent;

    &:hover {
      color: $paleDP;
      stroke: $paleDP;
      fill: $paleDP;
      transition: all 0.2s $animation;
    }
  }

  &.--small {
    padding: .25rem .5rem;
    font-size: .75rem;

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
    padding: .5rem 1rem;
    font-size: .875rem;
    height: 36px;

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
    padding: .75rem 1.25rem;
    font-size: 1rem;

    .button__label {
      
      & + .icon {
       margin-left: 10px;
      }
   }

    .icon {
      width: 1.75rem;
    }
  }

  &:not(.--outlined):not(.--text) {
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
