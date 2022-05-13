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
            <img
              v-if="details.get(props.row.id).thumb"
              :src="details.get(props.row.id).thumb"
              class="o-table__details-thumb"
            />

            <div class="o-table__details-data">
              <p>{{ details.get(props.row.id).notes }}</p>
              <p>{{ details.get(props.row.id).released }}</p>
              <p>{{ details.get(props.row.id).styles.join(', ') }}</p>
              <ul>
                <li
                  v-for="video in details.get(props.row.id).videos"
                  :key="video.uri"
                >
                  <iframe
                    width="560"
                    height="315"
                    :src="`https://www.youtube.com/embed/${video.uri.split('v=')[1]}`"
                    :title="video.title"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                  <span>{{ video.description }}</span>
                </li>
              </ul>
            </div>
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

<style lang="scss" scoped>

.o-table {

  &__details {

    &-content {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 25px;
    }

    &-thumb {
      border-radius: 5px;
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

</style>
