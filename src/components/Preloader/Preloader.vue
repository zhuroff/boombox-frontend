<template>
  <div :class="`preloader --${mode}`">
    <svg class="preloader__icon" width="98px" height="98px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" stroke="none">
        <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 51;360 50 51"></animateTransform>
      </path>
    </svg>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'
import './Preloader.scss'

export default defineComponent({
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value: string) => (
        ['dark', 'light'].includes(value)
      )
    }
  }
})

</script>
