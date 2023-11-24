<template>
  <div
    :class="[{
      '--small' : size === 'small',
      '--medium' : size === 'medium',
      '--large' : size === 'large',
      '--inverted' : isInverted,
      '--focused' : isFocused
    }, 'input-search']"
    @click="() => searchInput.focus()"
  >
    <div :class="[{ '--button' : !isFocused && !localValue }, 'input-search__icon']">
      <Sprite name="loupe" />
    </div>
    <input
      v-model="localValue"
      ref="searchInput"
      spellcheck="false"
      class="input-search__element"
      :type="type"
      :placeholder="placeholder"
      @blur="isFocused = false"
      @focus="isFocused = true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { debounce } from '~/utils'
import { useLocales } from '~/hooks/useLocales'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  name: 'InputText',
  components: {
    Sprite
  },
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => (
        ['password', 'text', 'number', 'search', 'email', 'tel'].includes(value)
      )
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    isInverted: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: false,
      default: ''
    },
    size: {
      type: String,
      required: false,
      default: 'medium',
      validator: (value: string) => (
        ['small', 'medium', 'large'].includes(value) 
      )
    }
  },

  setup({ value }, { emit }) {
    const { lang } = useLocales()
    const searchInput = ref<HTMLInputElement>(null!)
    const isFocused = ref(false)
    const localValue = ref(value)

    const emitInputValue = debounce((value: string) => {
      emit('setInputValue', value)
    })
    
    watch(
      localValue,
      (value) => emitInputValue(value),
      { immediate: false } 
    )

    return {
      lang,
      searchInput,
      isFocused,
      localValue
    }
  },
})
</script>

<style lang="scss">
@import '~/scss/variables';

.input-search {
  position: relative;
  display: flex;
  align-items: center;
  color: $paleDP;
  flex-grow: 1;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    max-width: 0;
    opacity: 0;
    background-color: $paleDP;
    transition: all 0.3s $animation;
  }

  &.--small {
    font-size: 0.875rem;

    .input-search__element {
      height: 30px;
    }
  }

  &.--medium {
    font-size: 1rem;

    .input-search__element {
      height: 40px;
    }
  }

  &.--large {
    font-size: 1.25rem;

    .input-search__element {
      height: 50px;

      &:focus {
        color: $white;
      }
    }
  }

  &.--focused {

    &:after {
      max-width: 100%;
      opacity: 1;
      transition: all 0.3s $animation;
    }
  }

  &.--inverted {
    
    .input-search__element {

      &:focus {
        color: $white;
      }
    }
  }
  
  .icon {
    color: inherit;
    fill: $paleDP;
    width: 22px;
    height: 22px;
    transform: scale(-1, 1);
    cursor: pointer;
    position: relative;
    top: 1px;
  }

  &__element {
    width: 100%;
    padding: 0;
    font-size: inherit;
    border: 0;
    border-radius: 0;
    outline: 0;
    color: inherit;
    background-color: transparent;
    padding-left: 0.5rem;
    
    &:focus {
      color: $dark;
    }

    &::placeholder {
      color: $paleDP;
    }
  }
}
</style>
