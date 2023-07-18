<template>
  <li :class="[{ '--active' : isActive }, className]">
    <component
      :is="cardComponent"
      :card="card"
      :rootPath="rootPath"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import CardTile from './CardTile.vue';
import CardBox from './CardBox.vue'

export default defineComponent({
  name: 'Card',
  components: {
    CardTile,
    CardBox
  },
  props: {
    type: {
      type: String,
      required: true
    },
    card: {
      type: Object as PropType<unknown>,
      required: true
    },
    rootPath: {
      type: String,
      required: true
    },
    className: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup({ type }) {
    return { cardComponent: computed(() => type) }
  }
})
</script>
