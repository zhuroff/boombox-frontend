<template>
  <li
    v-if="gathering && id"
    :class="[{ '--selected' : isSelected }, 'entity-tabs__item']"
    @click="addToGathering"
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
        :placeholder="lang('collections.namePlaceholder')"
        :inputValue="title"
        @setInputValue="setCompilationName"
      />
      <Button
        icon="save"
        isOutlined
        :style="{ marginLeft: '0.5rem' }"
      />
    </form>
  </li>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue'
import { useLocales } from '~/hooks/useLocales'
import { hostString } from '~/utils'
import TextInput from './TextInput.vue'
import Button from './Button.vue'
import CollectionEntity from '~/classes/CollectionEntity'
import CompilationEntity from '~/classes/CompilationEntity'

export default defineComponent({
  name: 'GatheringTab',
  components: {
    TextInput,
    Button
  },
  props: {
    id: {
      type: String,
      required: false
    },
    gathering: {
      type: Array as PropType<(CollectionEntity<string> | CompilationEntity<string>)[]>,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    placeholderImage: {
      type: String,
      required: false
    },
    entityID: {
      type: String,
      required: true
    }
  },
  setup({ gathering, id, entityID }, { emit }) {
    const { lang } = useLocales()
    const isSelected = computed(() => (
      gathering && gathering.some((el) => {
        const isIdsEquals = el._id === id
        const entities = el instanceof CompilationEntity ? el.tracks : el.albums
        return isIdsEquals && entities.includes(entityID)
      })
    ))

    const host = (pathname: string) => hostString(pathname)
    const addToGathering = () => emit('addToGathering')
    const createCompilation = () => emit('createNewCompilation')
    const setCompilationName = (value: string) => emit('setCompilationName', value)

    return {
      lang,
      host,
      isSelected,
      createCompilation,
      setCompilationName,
      addToGathering
    }
  }
})
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
      pointer-events: none;
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
      @include serif(1rem, 600)
    }
  }

  &__form {
    display: flex;
  }
}
</style>~/classes/CompilationEntity~/classes/CollectionEntity