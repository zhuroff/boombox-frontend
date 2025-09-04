<template>
  <section class="settings__section">
    <h2 class="settings__section-heading">
      {{ localize('headings.users') }}
    </h2>

    <Table
      :rows="usersTableState.rows"
      :schema="usersTableState.schema"
      :headerConfig="tableHeaderConfig"
      @onEmit="(data: User[]) => emit('passUsers', data)"
    />
  </section>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { Table } from '~shared/UI'
import { useLocalization } from '~shared/model'
import type { BasicTableState, TableHeaderConfig, User } from '~shared/lib'

interface Props {
  usersTableState: BasicTableState
}

interface Emits {
  (e: 'passUsers', data: User[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()

const tableHeaderConfig = computed<TableHeaderConfig[]>(() => (
  props.usersTableState.schema.order.map((key) => {
    const heading = localize(`usersTable.${key}`)

    return {
      key,
      element: h('span', {}, heading)
    }
  })
))
</script>

<style lang="scss" scoped>
@use '~app/styles/variables' as var;

.settings__section {
  grid-area: users;

  &-heading {
    @include var.serif(1.75rem);
    margin-bottom: .5rem;
  }
}
</style>
