<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isPageLoaded || !isSynchronized"
        mode="light"
      />
    </transition>
    <transition name="flyUp">
      <div
        v-if="isPageLoaded"
        class="settings"
      >
        <div class="settings__actions">
          <Button
            :label="lang('settings.createBackup')"
            @click="createBackups"
          />
          <Button
            :label="lang('settings.synchronize')"
            @click="syncCollection"
          />
          <Dropdown
            size="medium"
            :items="langSelectItems"
            :selectedValue="currentLocale"
            :style="{ width: '170px' }"
            @applyValue="(option) => setLocale(option.value)"
          />
        </div>
        <table class="settings__table">
          <tbody class="settings__table-body">
            <tr
              v-for="item in backups"
              :key="item.timestamp"
              class="settings__table-row"
            >
              <td class="settings__table-cell">{{ item.dateCreation }}</td>
              <td class="settings__table-cell">
                <Button
                  :label="lang('restore')"
                  @click="backupRestore(item.timestamp)"
                />
                <Button
                  :label="lang('delete')"
                  @click="backupDelete(item.timestamp)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="settings__form">
          <Form
            :schema="userSchema"
            :style="{ gap: '0.5rem', display: 'flex', flexDirection: 'column', maxWidth: '500px' }"
            @formSubmit="createUser"
          />
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, ComputedRef } from 'vue'
import { DropdownItem, SyncResponse } from '~/types/Common'
import { UserCreating } from '~/types/User'
import { JSONSchema4 } from 'json-schema'
import { useLocales } from '~/hooks/useLocales'
import userFormSchema from '~/schemas/userFormSchema.json'
import Preloader from '~/components/Preloader.vue'
import Button from '~/components/Button.vue'
import Dropdown from '~/components/Inputs/Dropdown.vue'
import Form from '~/components/Form.vue'
import api from '~/api'
import store from '~/store'

interface BackupList {
  timestamp: number
  dateCreation: string
}

export default defineComponent({
  components: {
    Button,
    Dropdown,
    Preloader,
    Form
  },

  setup() {
    const { allLocales, setLocale, lang } = useLocales()
    const { actions, getters } = store
    const backups = reactive([]) as unknown as BackupList[]
    const isPageLoaded = ref(false)
    const isSynchronized = ref(true)
    const userSchema = userFormSchema as JSONSchema4

    const langSelectItems: ComputedRef<DropdownItem[]> = computed(() =>[
      {
        label: lang('languages.en'),
        value: 'en',
        icon: 'flag-en'
      },
      {
        label: lang('languages.by'),
        value: 'by',
        icon: 'flag-by'
      }
    ])

    const currentLocale = computed(() => getters.currentLocale)

    const setBackups = (data: string[]) => {
      const dateConfig = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      } as const
      
      backups.length = 0
      backups.push(...data.map((el: string) => ({
        timestamp: Number(el),
        dateCreation: new Date(Number(el)).toLocaleDateString('ru-RU', dateConfig)
      })))
      isPageLoaded.value = true
    }

    const fetchBackups = async () => {
      try {
        const response = await api.get('/api/backup')

        if (response) setBackups(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const createBackups = async () => {
      try {
        const response = await api.post('/api/backup/save')
        
        if (response.status === 201) {
          actions.setSnackbarMessage({
            message: response.data.message,
            type: 'success'
          })

          fetchBackups()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const backupRestore = async (timestamp: number) => {
      try {
        const response = await api.post(`/api/backup/restore/${timestamp}`)
        
        if (response.status === 201) {
          actions.setSnackbarMessage({
            message: response.data.message,
            type: 'success'
          })

          fetchBackups()
        }
      } catch (error) {
        console.error(error)
      }
    }

    const backupDelete = async (timestamp: number) => {
      try {
        const response = await api.delete(`/api/backup/${timestamp}`)

        if (response.status === 201) {
          actions.setSnackbarMessage({
            message: response.data.message,
            type: 'success'
          })

          fetchBackups()
        }

      } catch (error) {
        console.error(error)
      }
    }

    const getSyncReport = (data: SyncResponse) => {
      return Object.entries(data)
        .reduce((acc, [key, value], index, arr) => {
          if (!Array.isArray(value)) {
            acc += `<li>${lang(`syncResponse.${key}`)}: ${value}</li>`
          } else {
            if (!value.length) {
              acc += `<li>${lang(`syncResponse.${key}`)}: 0</li>`
            } else {
              acc += `
                <li>
                  <span style="display: block">${lang(`syncResponse.${key}`)}:</span>  
                  ${value.map((row) => (
                    `<ul style="margin: 5px 0">
                      <li>${lang('syncResponse.invalidValue.album')}: ${row.album}</li>
                      <li>${lang('syncResponse.invalidValue.cloud')}: ${row.cloud}</li>
                      <li>${lang('syncResponse.invalidValue.reason')}: ${lang(`syncResponse.invalidValue.${row.reason}`)}</li>
                    <ul>`
                  ))}
                </li>
              `
            }
          }

          if (index === arr.length - 1) {
            acc += '</ul>'
          }
          return acc
        }, '<ul>')
    }

    const syncCollection = async () => {
      isSynchronized.value = false

      try {
        const response = await api.post<SyncResponse>('/api/sync')
        isSynchronized.value = true

        if (response.status === 200) {
          Object.entries(response.data)
            .forEach(([key, value]) => {
              console.log(lang(`syncResponse.${key}`), value)
            })

          actions.setSnackbarMessage({
            message: getSyncReport(response.data),
            type: 'success',
            time: 10000
          })
        }
      } catch (error) {
        isSynchronized.value = true
        throw error
      }
    }

    const createUser = async (payload: UserCreating) => {
      if (payload.password !== payload.passwordRepeat) {
        return actions.setSnackbarMessage({
          message: lang('userForm.errors.passwordsDoNotMatch'),
          type: 'error',
          time: 5000
        })
      }
    }

    onMounted(() => fetchBackups())

    return {
      lang,
      allLocales,
      setLocale,
      isPageLoaded,
      backups,
      createBackups,
      backupRestore,
      backupDelete,
      syncCollection,
      isSynchronized,
      langSelectItems,
      currentLocale,
      userSchema,
      createUser
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';

.settings {
  padding: 25px;

  &__actions {
    margin-bottom: 25px;
    display: flex;
    gap: 0.5rem;
  }

  &__table {

    &-row {
      border-bottom: 1px solid $paleLT;

      &:last-child {
        border-bottom: 0;
      }
    }

    &-cell {
      padding: 5px 10px;
      border-right: 1px solid $paleLT;

      &:first-child {
        padding-left: 0;
        font-weight: 600;
      }

      &:last-child {
        padding-right: 0;
        border-right: 0;
      }

      .button {
        &:not(:first-of-type) {
          margin-left: 0.5rem;
        }
      }
    }
  }

  &__form {
    margin-top: 25px;
  }
}
</style>
