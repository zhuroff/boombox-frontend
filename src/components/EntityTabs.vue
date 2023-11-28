<template>
  <div class="entity-tabs">
    <Preloader
      v-if="isLoading"
      mode="dark"
    />
    <div
      v-else
      class="entity-tabs__content"
    >
      <ul class="entity-tabs__list">
        <li
          v-for="tab in results"
          :key="tab._id"
          class="entity-tabs__item"
        >{{ tab.title }}</li>
        <li class="entity-tabs__item">ADD</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Pagination } from '~/types/Common'
import { Compilation } from '~/types/Compilation'
import Preloader from './Preloader.vue'

export default defineComponent({
  name: 'EntityTabs',
  components: {
    Preloader
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    results: {
      type: Array as PropType<Compilation[]>,
      required: true
    },
    pagination: {
      type: Object as PropType<Pagination>,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';

.entity-tabs {
  width: calc(100vw - 20px);
  max-width: 1200px;
  max-height: calc(100vh - 50px);
  overflow: auto;
  background-color: $white;
  border-radius: $borderRadiusLG;
  padding: 25px;

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  &__item {
    border-radius: $borderRadiusSM;
    padding: 1rem;
    box-shadow: $shadowLight;
    cursor: pointer;
  }
}
</style>
