<template>
  <OTable
    :data="table"
    :custom-detail-row="true"
    :show-detail-icon="true"
    @details-open="detailsOpen"
    detail-key="id"
    default-sort-direction="asc"
    default-sort="year"
    detailed
    hoverable
  >
    <OTableColumn
      field="title"
      label="Title"
      v-slot="props"
    >
      <a
        :href="`https://discogs.com${props.row.uri}`"
        class="o-table__link"
        target="_blank"
      >{{ props.row.title }}</a>
      ({{ props.row.format?.join(', ') }})
    </OTableColumn>

    <OTableColumn
      field="label"
      label="Label"
      sortable
      v-slot="props"
    >{{ props.row.label[0] || '' }}</OTableColumn>

    <OTableColumn
      field="catno"
      label="Cat#"
      v-slot="props"
    >{{ props.row.catno }}</OTableColumn>

    <OTableColumn
      field="country"
      label="Country"
      sortable
      v-slot="props"
    >{{ props.row.country }}</OTableColumn>

    <OTableColumn
      field="year"
      label="Year"
      sortable
      v-slot="props"
    >{{ props.row.year || 'Unknown' }}</OTableColumn>

    <template #detail="props">
      <tr class="o-table__details">
        <td colspan="6">
          <div
            v-if="details.has(props.row.id)"
            class="o-table__details-content"
          >
            {{ details.get(props.row.id).country }},
            {{ details.get(props.row.id).lowest_price }}
          </div>

          <div
            v-else
            class="o-table__details-content"
          >Loading...</div>
        </td>
      </tr>
    </template>
  </OTable>
</template>

<script lang="ts">

import { defineComponent, PropType, reactive } from 'vue'
import { DiscogsDetails, DiscogsItem } from '~/types/Album'
import DiscogsServices from '~/services/DiscogsServices'

export default defineComponent({
  name: 'DiscogsTable',

  props: {
    table: {
      type: Array as PropType<DiscogsItem[]>,
      required: true
    }
  },

  setup() {
    const details = reactive(new Map<number, DiscogsDetails>())

    const detailsOpen = ({ id }: { id: number }) => {
      if (!details.has(id)) {
        DiscogsServices.discogsDetails(id)
          .then((response) => details.set(id, response))
          .catch((error) => console.dir(error))
      }
    }

    return {
      details,
      detailsOpen
    }
  }
})

</script>
