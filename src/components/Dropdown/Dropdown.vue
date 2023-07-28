<template>
  <div class="dropdown">
    <Button
      :text="`${triggerLabel}: ${selectedOptionTitle}`"
      @click="dropdownTrigger"
    />
    <FloatModal
      v-if="isActive"
      :isFetched="true"
      :isEmpty="false"
    >
      <template v-slot:list>
        <ul class="dropdown__list">
          <DropdownItem
            v-for="item in options"
            :key="item.value"
            :option="item"
            @chooseItem="chooseItem"
          />
        </ul>
      </template>
    </FloatModal>
  </div>
</template>

<script lang="ts">

import { computed, defineComponent, PropType, ref } from 'vue'
import { DropdownOption } from '~/types/Global'
import Button from '~/components/Button/Button.vue'
import FloatModal from '~/components/FloatModal/FloatModal.vue'
import DropdownItem from './DropdownItem.vue'
import './Dropdown.scss'

export default defineComponent({
  name: 'Dropdown',

  components: {
    Button,
    FloatModal,
    DropdownItem
  },

  props: {
    options: {
      type: Array as PropType<DropdownOption<any>[]>,
      required: true
    },

    triggerLabel: {
      type: String,
      required: false,
      default: 'Sorting'
    }
  },

  setup(props, { emit }) {
    const isActive = ref(false)

    const dropdownTrigger = () => {
      isActive.value = !isActive.value
    }

    const chooseItem = (value: any) => {
      emit('chooseItem', value)
      isActive.value = false
    }

    const selectedOptionTitle = computed(() => (
      props.options.find(({ isActive }) => isActive)?.title || ''
    ))

    return {
      isActive,
      dropdownTrigger,
      chooseItem,
      selectedOptionTitle
    }
  }
})

</script>
