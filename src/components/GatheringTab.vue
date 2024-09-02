<template>
  <li
    v-if="gathering && id"
    :class="[{ '--selected' : isSelected }, 'entity-tabs__item']"
    @click="() => {
      isSelected ? removeFromGathering() : addToGathering()
    }"
  >
    <div class="entity-tabs__tab">
      <img
        v-if="avatar || placeholderImage"
        :src="avatar ? host(avatar) : placeholderImage"
      />
      <span>{{ title }}</span>
    </div>
  </li>
  <li
    v-else
    class="entity-tabs__item"
  >
    <form
      class="entity-tabs__form"
      @submit.prevent="createCompilation"
    >
      <TextInput
        :placeholder="localize(`${entityType}.namePlaceholder`)"
        :inputValue="title"
        @setInputValue="setCompilationName"
      />
      <Button
        :label="localize('save')"
        :style="{ marginLeft: '0.5rem' }"
      />
    </form>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasicEntity } from '~/types/Common'
import useGlobalStore from '~/store/global'
import { hostString } from '~/utils'
import TextInput from '~/components/Inputs/TextInput.vue'
import Button from './Button.vue'
import CollectionEntity from '~/classes/CollectionEntity'
import CompilationItem from '~/classes/CompilationItem'

interface Props {
  title: string
  entityID: string
  id?: string
  gathering?: (CollectionEntity<BasicEntity> | CompilationItem<BasicEntity>)[]
  avatar?: string
  placeholderImage?: string
  entityType?: string
}

interface Emits {
  (e: 'addToGathering'): void
  (e: 'removeFromGathering'): void
  (e: 'createNewCompilation'): void
  (e: 'setCompilationName', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  globalGetters: { localize }
} = useGlobalStore()

const isSelected = computed(() => (
  props.gathering?.some((el) => {
    const isIdsEquals = el._id === props.id
    const entities = 'albums' in el ? el.albums : el.tracks
    return isIdsEquals && entities.some(({ _id }) => _id === props.entityID)
  })
))

const host = (pathname: string) => hostString(pathname)
const addToGathering = () => emit('addToGathering')
const removeFromGathering = () => emit('removeFromGathering')
const createCompilation = () => emit('createNewCompilation')
const setCompilationName = (value: string) => emit('setCompilationName', value)
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';
.entity-tabs {

  &__item {
    border-radius: $borderRadiusSM;
    padding: 1rem;
    box-shadow: $shadowLight;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.--selected {
      background-color: $paleLT;
      box-shadow: rgb(200, 208, 231) 3.2px 3.2px 8px 0px inset, rgb(255, 255, 255) -3.2px -3.2px 8px 0px inset;
    }
  }

  &__tab {
    display: grid;
    grid-template-columns: 50px auto;
    gap: 1rem;
    align-items: center;
    flex-grow: 1;

    img {
      width: 50px;
      height: 50px;
      border-radius: $borderRadiusSM;
    }

    span {
      @include serif(1rem);
      color: $black;
    }
  }

  &__form {
    display: flex;
  }
}
</style>
~/classes/CompilationItem