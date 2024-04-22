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
      <Button
        :label="currentValue.label"
        :icon="currentValue.icon"
        :style="{ paddingRight: '2rem', width: '100%', justifyContent: 'flex-start' }"
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
    inputValue: {
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
  setup({ items, inputValue }, { emit }) {
    const isOptionsOpened = ref(false)

    const currentValue = computed(() => {
      const current = items.find(({ value }) => value === inputValue?.value)
      console.log(current)
      return {
        label: current?.label,
        icon: current?.icon
      }
    })

    const applyValue = (option: DropdownItem) => {
      emit('applyValue', option)
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

    & > .icon {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    &.--small > .icon {
      width: 1rem;
      height: 1rem;
    }

    &.--medium > .icon {
      width: 1.25rem;
      height: 1.25rem;
    }

    &.--large > .icon {
      width: 1.5rem;
      height: 1.5rem;
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
