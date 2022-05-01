<template>
  <button
    :class="[{ '--active' : isActive }, 'burger']"
    @click="burgerClick"
  ><span></span></button>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ButtonBurger',

  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },

  setup(_, { emit }) {
    const burgerClick = () => {
      emit('burgerClick')
    }

    return { burgerClick }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.burger {
  outline: none;

  @include media('<laptop') {
    transform: translateX(-50px);
    width: 50px;
    height: 50px;
    background-color: transparent;
    padding: 0;
    border: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    transition: all 0.7s $animation;
    
    &::before,
    &::after,
    span {
      content: '';
      width: 18px;
      height: 2px;
      background-color: $pale;
      margin: 2px 0;
      transition: all 0.5s cubic-bezier(.17,.67,.35,.99);
    }
    
    &.--active {
      transform: translateX(0);
      right: 0;
      top: 0;
      left: auto;
      transition: all 0.7s $animation;

      &::before,
      &::after,
      span {
        position: absolute;
        transition: all 0.5s cubic-bezier(.17,.67,.35,.99);
      }
          
      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(135deg);
      }

      span {
        transform: rotate(35deg);
        opacity: 0;
      }
    }
  }

  @include media('>=laptop') {
    display: none;
  }
}

</style>
