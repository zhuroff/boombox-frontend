<template>
  <div class="synclist">
    <div
      v-if="!contentSections.length"
      class="synclist__empty"    
    >{{ localize('syncResponse.synchronizeEmpty') }}</div>
    <div
      class="synclist__section"
      v-for="[key, section] in contentSections"
      :key="key"
    >
      <h2 class="synclist__heading">
        {{ localize(`syncResponse.${key}`) }}
      </h2>
      <ul
        v-if="key !== 'invalid'"
        class="synclist__rows"
      >
        <AlbumSyncRow
          v-for="row in section"
          :key="row._id"
          :album="row"
          :isRoute="key === 'added' || key === 'updated'"
        />
      </ul>
      <ul
        v-else
        class="synclist__invalid"
      >
        <li
          v-for="(row, index) in section"
          :key="index"
          class="synclist__invalid-row"
        >
          <div
            v-for="[k, reason] in Object.entries(row)"
            :key="k"
          >
            <strong>{{ localize(`syncResponse.invalidValue.${k}`) }}</strong>: {{ reason }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalization } from '~shared/lib'
import AlbumSyncRow from './AlbumSyncRow.vue'
import type { SyncResponse } from '~features/sync'

interface Props {
  sections: SyncResponse
}

const props = defineProps<Props>()

const { localize } = useLocalization()

const contentSections = computed(() => {
  return (
    Object.entries(props.sections)
      .filter(([_, value]) => value.length > 0)
  )
})
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.synclist {
  padding: var.$mainPadding;
  background-color: var.$white;
  border-radius: var.$borderRadiusMD;
  display: flex;
  flex-direction: column;
  gap: var.$mainPadding;

  &__empty {
    @include var.serif(2rem);
    text-align: center;
  }

  &__heading {
    @include var.serif(1rem);
    margin-bottom: var.$fieldPadding;
  }

  &__invalid {
    display: flex;
    flex-direction: column;
    gap: var.$fieldPadding;

    &-row {
      border-bottom: 1px solid var.$paleMD;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
