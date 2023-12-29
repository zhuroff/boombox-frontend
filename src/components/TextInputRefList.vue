<template>
  <ul
    v-if="!isCreateModeActive && formRefsList.length"
    class="text-input__reflist">
    <li
      v-for="item in formRefsList"
      :key="item._id"
      class="text-input__refitem"
      @click="() => selectRefItem(item)"
    >{{ item.title }}</li>
  </ul>
  <div
    v-else-if="isCreateModeActive"
    class="text-input__refcreate"
  >
    <div class="text-input__refcreate-heading">
      Nothing was found among {{ refConfig.refEntityKey }}. Create a new one
    </div>
    <input
      class="text-input__element --medium"
      :placeholder="'Create new'"
      v-model="newEntityInput"
    />
    <Button
      icon="save"
      type="button"
      :disabled="newEntityInput.length < 3"
      isOutlined
      @click="createNewRefEntity"
    />
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent, watch, ref } from 'vue'
import { useSearch } from '~/hooks/useSearch'
import { BasicEntity, RefPayload } from '~/types/Common'
import { debounce } from '~/utils'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'TextInputRefList',
  components: {
    Button
  },
  props: {
    refConfig: {
      type: Object as PropType<RefPayload<string>>,
      required: true
    }
  },
  setup(props, { emit }) {
    const { results, searchSubmit } = useSearch()
    const isCreateModeActive = ref(false)
    const newEntityInput = ref('')
    const formRefsList = ref<BasicEntity[]>([])

    const fetchSearchEntities = debounce(async (query: string, entityKey: string) => {
      try {
        await searchSubmit(query, entityKey)
        const searchResultsData = results.value.find(({ key }) => key === entityKey)?.data || []
        if (searchResultsData.length) {          
          formRefsList.value = searchResultsData?.map(({ _id, title }) => ({ _id, title })) || []
          isCreateModeActive.value = false
        } else {
          isCreateModeActive.value = true
          newEntityInput.value = props.refConfig.refEntityValue
        }
      } catch (error) {
        console.error(error)
      }
    })

    const selectRefItem = (item: BasicEntity) => {
      emit('selectRefItem', {
        refEntityKey: props.refConfig.refEntityKey,
        refEntityValue: item
      })
      formRefsList.value = []
    }

    const createNewRefEntity = () => {
      console.log(props.refConfig.refEntityKey, newEntityInput.value)
    }

    watch(
      props,
      ({ refConfig: { refEntityKey, refEntityValue } }) => {
        if (refEntityValue.length >= 3) {
          fetchSearchEntities(refEntityValue, refEntityKey)
        } else {
          isCreateModeActive.value = false
          formRefsList.value = []
        }
      }
    )

    return {
      formRefsList,
      selectRefItem,
      newEntityInput,
      isCreateModeActive,
      createNewRefEntity
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/variables.scss';
@import 'include-media';
.text-input{
  &__reflist,
  &__refcreate {
    position: absolute;
    top: 100%;
    left: 0;
    box-shadow: $shadowMedium;
    border-radius: 0 0 $borderRadiusSM $borderRadiusSM;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    z-index: 1000;
    background-color: $white;
  }

  &__refcreate {
    padding: 1rem;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;

    &-heading {
      flex: none;
      width: 100%;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .text-input__element {
      flex: 1 1 0;
    }
  }

  &__refitem {
    cursor: pointer;
    padding: 0.5rem 1rem;

    &:hover {
      background-color: $dark;
      color: $white;
    }
  }
}
</style>
