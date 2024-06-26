<template>
  <div class="text-input">
    <div class="text-input__wrapper">
      <input
        :class="['text-input__element', `--${size}`, errorMessage ? '--error' : '']"
        :placeholder="placeholder && `${placeholder}${isRequired ? '*' : ''}`"
        :style="style"
        :type="type"
        :readonly="isReadonly"
        autocomplete="off"
        v-model="localValue"
      />
      <div
        v-if="errorMessage"
        class="text-input__error"
      >{{ errorMessage }}</div>
    </div>
    <TextInputRefList
      v-if="refEntityKey && isRefListActive"
      :refConfig="refConfig"
      @selectRefItem="selectRefItem"
    />
  </div>
</template>

<script lang="ts">
import { PropType, StyleValue, computed, defineComponent, nextTick, ref, watch } from 'vue'
import { BasicEntity, RefPayload } from '~/types/Common'
import TextInputRefList from './TextInputRefList.vue'

export default defineComponent({
  name: 'TextInput',
  components: {
    TextInputRefList
  },
  props: {
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
    type: {
      type: String,
      required: false,
      default: 'text',
      validator: (value: string) => ['text', 'password'].includes(value)
    },
    style: {
      type: Object as PropType<StyleValue>,
      required: false
    },
    inputValue: {
      type: String,
      required: false
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: false
    },
    isReadonly: {
      type: Boolean,
      required: false,
      default: false
    },
    refEntityKey: {
      type: String,
      required: false
    },
    errorMessage: {
      type: String,
      required: false
    }
  },
  setup(props, { emit }) {
    const localValue = ref(props.inputValue || '')
    const isRefListActive = ref(false)

    const refConfig = computed(() => ({
      refEntityKey: props.refEntityKey || '',
      refEntityValue: localValue.value
    }))

    const selectRefItem = (payload: RefPayload<BasicEntity>) => {
      isRefListActive.value = false
      nextTick(() => {
        localValue.value = payload.refEntityValue.title
        emit('setInputValue', payload.refEntityValue._id)
      })
    }

    watch(localValue, (newValue) => {
      if (!props.refEntityKey) {
        emit('setInputValue', newValue)
      }

      if (newValue.length >= 3 && props.refEntityKey) {
        isRefListActive.value = true
      }
    })

    return {
      localValue,
      refConfig,
      selectRefItem,
      isRefListActive
    }
  }
})
</script>

<style lang="scss">
@import '../../scss/variables.scss';
@import 'include-media';

.text-input {
  flex-grow: 1;
  position: relative;

  &__element {
    border-radius: $borderRadiusSM;
    border: 1px solid $paleMD;
    width: 100%;

    &.--medium {
      padding: .5rem 1rem;
      font-size: .875rem;
      height: $inputSizeMD;
    }

    &.--error {
      border-color: $error;
    }

    &::placeholder {
      color: $paleDP;
    }
  }

  &__error {
    color: $error;
    font-size: 0.75rem;
  }
}
</style>
