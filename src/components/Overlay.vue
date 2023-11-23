<template>
  <div class="overlay">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'Overlay',
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.overlay {
  position: absolute;
  padding: 25px;
  z-index: 1000;
  border-radius: $borderRadiusMD;
  background-color: $white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
