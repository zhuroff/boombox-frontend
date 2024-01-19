<template>
  <li class="card__toy">
    <router-link
      class="card__toy-link"
      :to="{ path: `/${rootPath}/${card.title}` }"
    >
      <span>{{ card.title }}</span>
    </router-link>
  </li>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { CloudEntity } from '~/types/ReqRes'

export default defineComponent({
  name: 'TOYYearCard',
  props: {
    card: {
      type: Object as PropType<CloudEntity>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';
.card__toy {
  border-radius: $borderRadiusSM;
  background-color: $black;
  border: 1px solid $black;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    background-color: $paleLT;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 0;
    transition: max-height 0.5s $animation;
  }
  
  &-link {
    color: $paleLT;
    display: flex;
    padding: 0.75rem 1rem;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    position: relative;
    z-index: 10;
    transition: color 0.5s $animation;
  }

  &:hover {
    &:before {
      max-height: 100%;
      transition: max-height 0.5s $animation;
    }

    .card__toy-link {
      color: $black;
      transition: color 0.5s $animation;
    }
  }
}
</style>
