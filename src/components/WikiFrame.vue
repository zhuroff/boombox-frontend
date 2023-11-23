<template>
  <div class="wikiframe">
    <iframe :src="frameURL" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WikiFrame',
  props: {
    frameURL: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.wikiframe {
  width: calc(100vw - 20px);
  height: calc(100vh - 50px);
  max-width: 1200px;
  max-height: calc(100vh - 50px);
  overflow: hidden;
  background-color: $white;
  border-radius: $borderRadiusLG;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
