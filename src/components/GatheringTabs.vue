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
        <GatheringTab
          v-for="tab in results"
          :key="tab._id"
          :id="tab._id"
          :gathering="results"
          :placeholderImage="placeholderImage"
          :avatar="tab.avatar"
          :title="tab.title"
          :entityID="entityID"
          @addToGathering="() => (
            addToGathering({
              entityType,
              entityID,
              order: getOrder(tab._id),
              gatheringID: tab._id
            })
              .then(() => addNewGathering(tab._id))
          )"
        />
        <GatheringTab
          :title="gatheringName"
          :entityID="entityID"
          @createNewCompilation="() => (
            createNewGathering({ entityType, entityID, results })
          )"
          @setCompilationName="setGatheringName"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import { Pagination } from '~/types/Common'
import { useGathering } from '~/hooks/useGathering'
import GatheringTab from './GatheringTab.vue'
import Preloader from './Preloader.vue'
import CollectionEntity from '~/classes/CollectionEntity'
import CompilationEntity from '~/classes/CompilationEntity'

export default defineComponent({
  name: 'GatheringTabs',
  components: {
    GatheringTab,
    Preloader
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true
    },
    results: {
      type: Array as PropType<(CollectionEntity<string> | CompilationEntity<string>)[]>,
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
      createNewGathering,
      setGatheringName,
      gatheringName,
      addToGathering
    } = useGathering()

    const getTargetEntities = (gatheringID: string) => {
      const target = results.find(({ _id }) => gatheringID === _id)
      if (target) {
        return target instanceof CollectionEntity ? target.albums : target.tracks
      }
    }

    const getOrder = (gatheringID: string) => {
      const entities = getTargetEntities(gatheringID)
      return entities && entities.length + 1
    }

    const addNewGathering = (gatheringID: string) => {
      const entities = getTargetEntities(gatheringID)
      entities?.push(entityID)
    }

    return {
      createNewGathering,
      setGatheringName,
      gatheringName,
      addToGathering,
      addNewGathering,
      getOrder
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
