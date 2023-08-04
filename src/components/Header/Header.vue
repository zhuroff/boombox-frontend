<template>
  <header class="header">
    <h1 class="header__heading">{{ heading }}</h1>
    <InputText
      v-if="!noSearch"
      type="search"
      placeholder="Search..."
    />
    <slot></slot>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InputText from '~/components/Inputs/InputText.vue';

export default defineComponent({
  name: 'Header',
  components: {
    InputText
  },
  props: {
    heading: {
      type: String,
      required: true
    },
    noSearch: {
      type: Boolean,
      required: false,
      default: false
    }
  }
})
</script>

<style lang="scss">
@import '~/scss/variables';
@import 'include-media';

.header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;

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
