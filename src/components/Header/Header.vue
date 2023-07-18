<template>
  <header class="header">
    <h1 class="header__heading">{{ heading }}</h1>
    <slot></slot>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
  props: {
    heading: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include media('<laptop') {
    background-color: $dark;
    color: $white;
    position: relative;
    padding: 75px 25px 0;

    &:after {
      content: '';
      width: 100vw;
      height: 75vh;
      background: linear-gradient(to bottom, $dark, $white);
      position: absolute;
      left: 0;
      top: 100%;
    }

    .dropdown {
      display: none;
    }
  }

  @include media('>=laptop') {
    padding: 25px 25px 0;
  }

  &__heading {
    @include media('<tablet') {
      font-size: 1.25rem;
      font-weight: 600;
    }

    @include media('>=tablet') {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}
</style>
