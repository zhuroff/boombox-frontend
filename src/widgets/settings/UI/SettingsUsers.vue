<template>
  <section class="settings__section">
    <h2 class="settings__section-heading">
      {{ localize('headings.users') }}
    </h2>

    <Table
      :tableState="usersTableState"
      :localeRootKey="'users'"
      @onEmit="(data) => emit('passUsers', data)"
    />
  </section>
</template>

<script setup lang="ts">
import { Table } from '~shared/UI'
import { useLocalization } from '~shared/model'
import type { TableConfig } from '~shared/lib'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import type { User } from '~entities/user'

interface Props {
  usersTableState: TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>
}

interface Emits {
  (e: 'passUsers', data: User[]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { localize } = useLocalization()
</script>

<style lang="scss" scoped>
@use '~/app/styles/variables' as var;

.settings__section {
  grid-area: users;

  &-heading {
    @include var.serif(1.75rem);
    margin-bottom: .5rem;
  }
}
</style>
