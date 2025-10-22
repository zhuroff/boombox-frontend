<template>
  <div :class="`loader --${mode}`">
    <svg
      class="loader__icon"
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

<script setup lang="ts">
interface Props {
  mode: 'dark' | 'light'
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;

  &.--dark {
    background-color: var.$transDark;
    
    .preloader__icon {
      fill: var.$white;
    }
  }

  &.--light {
    background-color: var.$transLight;

    // @include var.media('<desktop') {
    //   height: 100%;
    // }

    // @include var.media('>=desktop') {
    //   height: calc(100% - var.$playerHeight);
    // }
  }

  &__icon {
    
    path {
      fill: var.$paleDP;
    }
  }
}
</style>
