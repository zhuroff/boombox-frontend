<template>
  <div class="table">
    <div class="table__heading">
      <InputCheck
        type="checkbox"
        label="Official only"
        :isChecked="isOfficialsOnly"
        @checkInputChange="switchOfficials"
      />

      <Dropdown
        :options="Array.from(discogsFormats.values())"
        :triggerText="currentFormat"
        @chooseItem="setFormatFilter"
      />
    </div>

    <OTable
      :data="filteredTable"
      :custom-detail-row="true"
      :show-detail-icon="true"
      ref="discogsTableRef"
      detail-key="id"
      default-sort-direction="asc"
      default-sort="year"
      detailed
      hoverable
      @details-open="detailsOpen"
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
              v-if="!details.has(props.row.id)"
              class="o-table__details-content"
            >Loading...</div>

            <div
              v-if="details.has(props.row.id) && details.get(props.row.id).isInvalid"
              class="o-table__details-content"
            >Invalid data</div>

            <div
              v-if="details.has(props.row.id) && !details.get(props.row.id).isInvalid"
              class="o-table__details-content"
            >
              <img
                v-if="details.get(props.row.id).thumb"
                :src="details.get(props.row.id).thumb"
                class="o-table__details-thumb"
              />

              <div class="o-table__details-data">
                <p
                  v-if="details.get(props.row.id).notes"
                  class="o-table__details-item"
                >
                  {{ details.get(props.row.id).notes }}
                </p>

                <p
                  v-if="details.get(props.row.id).released"
                  class="o-table__details-item"
                >
                  <strong>Released:</strong> {{ details.get(props.row.id).released }}
                </p>

                <p
                  v-if="details.get(props.row.id).styles"
                  class="o-table__details-item"
                >
                  <strong>Styles:</strong> {{ details.get(props.row.id).styles.join(', ') }}
                </p>

                <ul
                  v-if="details.get(props.row.id).companies.length || details.get(props.row.id).labels.length"
                  class="o-table__details-list"
                >
                  <li
                    v-for="item in releaseCompanies(details.get(props.row.id).companies, details.get(props.row.id).labels)"
                    :key="item.id"
                  >
                    <span v-if="item.entity_type_name">{{ item.entity_type_name }}:&nbsp;</span>
                    <span v-if="item.name">{{ item.name }}&nbsp;</span>
                    <span v-if="item.catno">{{ item.catno }}</span>
                  </li>
                </ul>

                <ul
                  v-if="details.get(props.row.id).extraartists.length"
                  class="o-table__details-list"
                >
                  <li
                    v-for="item in details.get(props.row.id).extraartists"
                    :key="item.id"
                  >
                    <span v-if="item.name">{{ item.name }}</span>
                    <span v-if="item.role"> - {{ item.role }}&nbsp;</span>
                    <span v-if="item.tracks">({{ item.tracks }})</span>
                  </li>
                </ul>

                <ul
                  v-if="details.get(props.row.id).identifiers.length"
                  class="o-table__details-list"
                >
                  <li
                    v-for="item in details.get(props.row.id).identifiers"
                    :key="item.id"
                  >
                    <span v-if="item.type">{{ item.type }}&nbsp;</span>
                    <span v-if="item.value">{{ item.value }}&nbsp;</span>
                    <span v-if="item.description">{{ item.description }}</span>
                  </li>
                </ul>

                <ul
                  v-if="details.get(props.row.id).tracklist.length"
                  class="o-table__details-list"
                >
                  <li
                    v-for="item in details.get(props.row.id).tracklist"
                    :key="item.id"
                  >
                    <span v-if="item.position">{{ item.position }}.&nbsp;</span>
                    <span v-if="item.title"> {{ item.title }}&nbsp;</span>
                    <span v-if="item.duration">{{ item.duration }}</span>
                  </li>
                </ul>

                <ul
                  v-if="details.get(props.row.id).videos"
                  class="o-table__details-cards"
                >
                  <li
                    v-for="video in details.get(props.row.id).videos"
                    :key="video.uri"
                  >
                    <iframe
                      :src="`https://www.youtube.com/embed/${video.uri.split('v=')[1]}`"
                      :title="video.title"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                  </li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </OTable>
  </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, PropType, inject, reactive, ref, computed } from 'vue'
import { DiscogsCompanies, DiscogsDetails, DiscogsItem } from '~/types/Album'
import { DropdownOption } from '~/types/Global'
import { stringEqual } from '~/shared/stringifier'
import InputCheck from '~/components/Inputs/InputCheck.vue'
import Dropdown from '~/components/Dropdown/Dropdown.vue'
import DiscogsServices from '~/services/DiscogsServices'

export default defineComponent({
  name: 'DiscogsTable',

  components: {
    InputCheck,
    Dropdown
  },

  props: {
    table: {
      type: Array as PropType<DiscogsItem[]>,
      required: true
    }
  },

  setup(props) {
    const simplebar = inject<any>('simplebar')
    const discogsTableRef = ref(null)
    const isOfficialsOnly = ref(false)
    const currentFormat = ref('All formats')
    const discogsFormats = reactive(new Map<string, DropdownOption<string>>())
    const details = reactive(new Map<number, DiscogsDetails>())

    const filteredTable = computed(() => {
      if (currentFormat.value === 'All formats') {
        if (!isOfficialsOnly.value) {
          return props.table
        } else {
          return props.table.filter((row) => (
            !row.format.includes('Unofficial Release')
          ))
        }
      }

      return props.table.filter((row) => {
        const isRightFormat = !row.format?.length || row.format[0] === currentFormat.value
        const isOfficialMatter = isOfficialsOnly.value ? !row.format.includes('Unofficial Release') : true
        return isRightFormat && isOfficialMatter
      })
    })

    const switchOfficials = () => {
      isOfficialsOnly.value = !isOfficialsOnly.value
    }

    const checkAndSetDetails = (id: number, data: DiscogsDetails, title: string) => {
      details.set(id, stringEqual(title.split(' - ')[1], data.title) ? data : { ...data, isInvalid: true })
    }

    const detailsOpen = ({ id, title }: { id: number, title: string }) => {
      if (!details.has(id)) {
        DiscogsServices.discogsDetails(id)
          .then((response) => checkAndSetDetails(id, response, title))
          .catch((error) => console.dir(error))
      }
    }

    const releaseCompanies = (a: DiscogsCompanies[], b: DiscogsCompanies[]) => {
      return [...a, ...b]
    }

    const createFormatFilter = () => {
      discogsFormats.set(currentFormat.value, {
        isActive: true,
        title: currentFormat.value,
        value: currentFormat.value
      })

      props.table.forEach((row) => {
        if (row.format?.length && !discogsFormats.has(row.format[0])) {
          discogsFormats.set(row.format[0], {
            isActive: false,
            title: row.format[0],
            value: row.format[0]
          })
        }
      })
    }

    const setFormatFilter = (value: any) => {
      for (let item of discogsFormats.values()) {
        if (item.value === value) {
          item.isActive = true
          currentFormat.value = value
        } else {
          item.isActive = false
        }
      }
    }

    onMounted(() => {
      createFormatFilter()

      setTimeout(() => {
        // @ts-ignore
        simplebar.value.getScrollElement().scrollTop = Number(discogsTableRef.value?.$el.offsetTop)
      }, 1000)
    })

    return {
      switchOfficials,
      isOfficialsOnly,
      discogsFormats,
      setFormatFilter,
      discogsTableRef,
      currentFormat,
      filteredTable,
      details,
      detailsOpen,
      releaseCompanies
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
