<template>
  <button
    :class="['button', { '--outlined': isOutlined, '--inverted': isInverted }, `--${size}`]"
  >
    <span>{{ label ?? '' }}</span>
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
    isOutlined: {
      type: Boolean,
      required: false,
      default: false
    },
    isInverted: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
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
    border-color: $pale;
    color: $pale;
    transition: all 0.2s $animation;

    &:hover {
      border-color: $white;
      color: $white;
      transition: all 0.2s $animation;
    }
  }

  &.--small {
    padding: .25rem .5rem;
    font-size: .75rem;

    .icon {
      width: 1rem;
      margin-left: 3px;
    }
  }

  &.--medium {
    padding: .5rem 1rem;
    font-size: .875rem;

    .icon {
      width: 1.25rem;
      margin-left: 5px;
    }
  }

  &:not(.--outlined) {
    border-color: $dark;
    background-color: $dark;
    color: $white;
    transition: all 0.2s $animation;

    &:hover {
      border-color: $warning;
      background-color: $warning;
      color: $black;
      transition: all 0.2s $animation;
    }
  }
}
</style>
