<template>
  <div class="dropdown" :style="style">
    <div :class="[
      'dropdown__trigger',
      {
        '--small': size === 'small',
        '--medium': size === 'medium',
        '--large': size === 'large'
      }
    ]">
      <span
        v-if="placeholder && !currentValue.label"
        class="dropdown__trigger-label"
      >{{ placeholder }}</span>
      <Button
        type="button"
        :label="currentValue.label"
        :icon="currentValue.icon"
        :size="size"
        @click="isOptionsOpened = !isOptionsOpened"
      />
      <Sprite name="chevron-down" />
    </div>
    <transition name="fade">
      <div v-if="isOptionsOpened" class="dropdown__options">
        <ul class="dropdown__options-list">
          <li
            v-for="option in items"
            :key="option.value"
            :class="[
              'dropdown__options-item',
              {
                '--small': size === 'small',
                '--medium': size === 'medium',
                '--large': size === 'large'
              }
            ]"
            @click="applyValue(option)"
          >
            <Sprite v-if="option.icon" :name="option.icon" />
            <span class="dropdown__options-label">{{ option.label }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ComputedRef, PropType, Ref, StyleValue, computed, defineComponent, ref } from 'vue'
import { DropdownItem } from '~/types/Common'
import Button from '../Button.vue'
import Sprite from '../Sprite/Sprite.vue'

export default defineComponent({
  name: 'Dropdown',
  components: {
    Button,
    Sprite
  },
  props: {
    items: {
      type: Array as PropType<DropdownItem[]>,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
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
    selectedValue: {
      type: Object as PropType<ComputedRef<string> | Ref<string>>,
      required: false
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: false
    },
    errorMessage: {
      type: String,
      required: false
    }
  },
  setup({ items, selectedValue }, { emit }) {
    const isOptionsOpened = ref(false)

    const currentValue = computed(() => {
      const current = items.find(({ value }) => value === selectedValue?.value)
      return {
        label: current?.label,
        icon: current?.icon
      }
    })

    const applyValue = (option: DropdownItem) => {
      emit('applyValue', option)
      isOptionsOpened.value = false
    }

    return {
      isOptionsOpened,
      currentValue,
      applyValue
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';

.dropdown {
  position: relative;

  &__trigger {
    position: relative;

    & > .button {
      padding-right: 2rem;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      border-color: $paleMD;

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

    &.--small {

      .dropdown__trigger-label {
        font-size: .75rem;
        left: .875rem;
      }

      & > .icon {
        width: 1rem;
        height: 1rem;
      }
    }

    &.--medium {

      .dropdown__trigger-label {
        font-size: .875rem;
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
      color: $paleDP;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &__options {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;

    &-list {
      background-color: $white;
      margin: 0;
      padding: 0.5rem 0;
      box-shadow: $shadowMedium;
      border-radius: $borderRadiusMD;
    }

    &-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: all 0.2s $animation;

      &:hover {
        background-color: $black;
        color: $white;
        transition: all 0.2s $animation;
      }

      &.--small {
        padding: 0 0.5rem;
        font-size: .75rem;

        .icon {
          width: 1rem;

          & + .dropdown__options-label {
            margin-left: 3px;
          }
        }
      }

      &.--medium {
        padding: .25rem 1rem;
        font-size: 1rem;

        .icon {
          width: 1.25rem;

          & + .dropdown__options-label {
            margin-left: 5px;
          }
        }
      }

      &.--large {
        padding: .5rem 1.5rem;
        font-size: 1.25rem;

        .icon {
          width: 1.75rem;

          & + .dropdown__options-label {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
