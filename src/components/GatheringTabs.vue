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
          @addToGathering="() => addEntityToGathering(tab, results)"
          @removeFromGathering="() => removeEntityFromGathering(tab._id, results)"
        />
        <GatheringTab
          :title="gatheringName"
          :entityID="entityID"
          :entityType="entityType"
          @createNewCompilation="() => (
            createNewGathering({ entityType, entityID, results })
          )"
          @setCompilationName="setGatheringName"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasicEntity, Pagination } from '~/types/Common'
import { useGathering } from '~/hooks/useGathering'
import GatheringTab from './GatheringTab.vue'
import Preloader from './Preloader.vue'
import CollectionEntity from '~/classes/CollectionEntity'
import CompilationItem from '~/classes/CompilationItem'

interface Props {
  isLoading: boolean
  results: (CollectionEntity<BasicEntity> | CompilationItem<BasicEntity>)[]
  pagination: Pagination
  entityID: string
  entityType: string
  placeholderImage: string
}

const props = defineProps<Props>()

const {
  removeFromGathering,
  createNewGathering,
  setGatheringName,
  gatheringName,
  addToGathering
} = useGathering()

const addEntityToGathering = (gathering: typeof props.results[number], gatherings: typeof props.results) => {
  addToGathering({
    entityID: props.entityID,
    entityType: props.entityType,
    gatheringID: gathering._id,
    order: getOrder(gathering._id, gatherings) || 1,
    isInList: false
  })
    .then(() => addNewGathering(gathering, gatherings))
}

const removeEntityFromGathering = (gatheringID: string, gatherings: typeof props.results) => {
  removeFromGathering({
    entityID: props.entityID,
    entityType: props.entityType,
    gatheringID,
    isInList: true
  })
    .then(() => deleteEntityFromGathering(gatheringID, gatherings))
}

const getTargetEntities = (gatheringID: string, gatherings: typeof props.results) => {
  const target = gatherings.find(({ _id }) => gatheringID === _id)
  if (target) {
    return target instanceof CollectionEntity ? target.albums : target.tracks
  }
}

const getOrder = (gatheringID: string, gatherings: typeof props.results) => {
  const entities = getTargetEntities(gatheringID, gatherings)
  return entities && entities.length + 1
}

const addNewGathering = (gathering: typeof props.results[number], gatherings: typeof props.results) => {
  const entities = getTargetEntities(gathering._id, gatherings)
  entities?.push({ _id: props.entityID, title: '' })
}

const deleteEntityFromGathering = (gatheringID: string, gatherings: typeof props.results) => {
  const entities = getTargetEntities(gatheringID, gatherings)
  if (entities) {
    const index = entities.findIndex(({ _id }) => _id === props.entityID)
    entities.splice(index, 1)
  }
}
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