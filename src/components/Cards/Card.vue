<template>
  <component
    :is="cardComponent"
    :card="card"
    :rootPath="rootPath"
    className="className"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import CardTile from './CardTile.vue';

export default defineComponent({
  name: 'Card',
  components: {
    CardTile
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
      required: false,
      default: ''
    }
  },
  setup({ type }) {
    const cardComponent = computed(() => {
      switch(type) {
        case 'CardTile':
          return 'CardTile'
        default: 
          return 'CardTile'
      }
    })

    return { cardComponent }
  }
})
</script>
