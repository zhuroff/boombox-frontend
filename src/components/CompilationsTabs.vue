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
        <CompilationTab
          v-for="tab in results"
          :key="tab._id"
          :id="tab._id"
          :compilations="results"
          :placeholderImage="placeholderImage"
          :avatar="tab.avatar"
          :title="tab.title"
          :entityID="entityID"
          @addToCompilation="() => (
            addToCompilation({ entityType, entityID, results, compilationID: tab._id })
          )"
        />
        <CompilationTab
          :title="compilationName"
          :entityID="entityID"
          @createNewCompilation="() => createNewCompilation({ entityType, entityID, results })"
          @setCompilationName="setCompilationName"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Pagination } from '~/types/Common'
import { Compilation } from '~/types/Compilation'
import { useCompilation } from '~/hooks/useCompilation'
import CompilationTab from './CompilationTab.vue'
import Preloader from './Preloader.vue'

export default defineComponent({
  name: 'CompilationsTabs',
  components: {
    CompilationTab,
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
    },
    entityID: {
      type: String,
      required: true
    },
    entityType: {
      type: String,
      required: true
    },
    placeholderImage: {
      type: String,
      required: true
    }
  },
  setup({ results, entityID }) {
    const {
      createNewCompilation,
      setCompilationName,
      compilationName,
      addToCompilation
    } = useCompilation()

    return {
      createNewCompilation,
      setCompilationName,
      addToCompilation,
      compilationName
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
}
</style>
