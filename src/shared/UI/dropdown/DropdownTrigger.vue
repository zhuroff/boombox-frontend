<template>
  <div
    :class="[
      'dropdown__trigger',
      {
        '--small': size === 'small',
        '--medium': size === 'medium',
        '--large': size === 'large',
        '--inverted': isInverted
      }
    ]"
  >
    <span
      v-if="placeholder && !currentValue.label"
      class="dropdown__trigger-label"
      >{{ placeholder }}</span
    >
    <Button
      type="button"
      :label="currentValue.label"
      :icon="currentValue.icon"
      :size="size"
      @click="emit('triggerToggle')"
    />
    <Sprite name="chevron-down" />
  </div>
</template>

<script setup lang="ts">
import { Button, Sprite } from '~shared/UI'

interface Props {
  placeholder: string
  size: 'small' | 'medium' | 'large'
  currentValue: {
    label: string
    icon?: string
  }
  isInverted?: boolean
}

interface Emits {
  (e: 'triggerToggle'): void
}

withDefaults(defineProps<Props>(), {
  isInverted: false
})
const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.dropdown__trigger {
  position: relative;

  & > .button {
    padding-right: 2rem;
    padding-left: var.$basicPadding;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    border-color: var.$paleMD;

    &:hover {
      background-color: inherit;
      color: inherit;
    }
  }

  & > .icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  &.--inverted {
    & > .button {
      border-color: var.$paleLW;
      color: var.$paleLW;
      background-color: transparent;

      .icon {
        fill: var.$paleLW;
      }

      &:hover {
        background-color: transparent;
        color: var.$light;

        .icon {
          fill: var.$light;
        }
      }
    }

    & > .icon {
      fill: var.$paleLW;
    }

    &:hover > .icon {
      fill: var.$light;
    }
  }

  &.--small {
    .dropdown__trigger-label {
      font-size: 0.75rem;
      left: 0.875rem;
    }

    & > .icon {
      width: 1rem;
      height: 1rem;
    }
  }

  &.--medium {
    .dropdown__trigger-label {
      font-size: 0.875rem;
      left: 1rem;
    }

    & > .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &.--large {
    .dropdown__trigger-label {
      font-size: 1rem;
      left: 1.25rem;
    }

    & > .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    display: block;
    color: var.$paleDP;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
