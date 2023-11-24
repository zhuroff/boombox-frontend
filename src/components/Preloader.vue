<template>
  <div :class="`preloader --${mode}`">
    <svg
      class="preloader__icon"
      width="98px"
      height="98px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <path
        d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
        stroke="none"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="1s"
          repeatCount="indefinite"
          keyTimes="0;1"
          values="0 50 51;360 50 51"
        ></animateTransform>
      </path>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Preloader',
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

<style lang="scss">
@import '../scss/variables.scss';
@import 'include-media';

.preloader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;

  &.--dark {
    height: 100%;
    
    .preloader__icon {
      fill: $white;
    }
  }

  &.--light {
    background-color: $transLight;

    @include media('<laptop') {
      height: 100vh
    }

    @include media('>=laptop') {
      height: calc(100vh - #{$playerHeight});
    }
  }

  &__icon {
    
    path {
      fill: $paleDP;
    }
  }
}
</style>
