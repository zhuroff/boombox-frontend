<template>
  <label class="input__check">
    <input
      :type="type"
      @change="$emit('checkInputChange')"
    />
    <span v-if="label">{{ label }}</span>
  </label>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InputCheck',

  props: {
    type: {
      type: String,
      required: true
    },

    isChecked: {
      type: Boolean,
      required: true
    },

    label: {
      type: String,
      required: false
    }
  },
  
  setup() {
    
  },
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.input__check {
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  display: flex;
  align-items: center;

  input {
    width: 20px;
    height: 20px;
  }

  span {
    margin-left: 10px;
    font-size: 16px;
  }
}

</style>
