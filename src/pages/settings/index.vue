<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!isPageLoaded || isReloading"
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
            v-if="isAdmin"
            :label="lang('settings.createBackup')"
            @click="createBackups"
          />
          <Button
            v-if="isAdmin"
            :label="lang('settings.synchronize')"
            @click="syncCollection"
          />
          <Button
            :label="lang('settings.logout')"
            @click="logout"
          />
          <Dropdown
            size="medium"
            :items="langSelectorConfig.options"
            :selectedValue="langSelectorConfig.locale"
            :style="{ width: '170px' }"
            @applyValue="(option) => setLocale(option.value)"
          />
        </div>
        <section
          v-if="isAdmin"
          class="settings__section"
        >
          <h2 class="settings__section-heading">{{ lang('headings.backups') }}</h2>
          <table class="settings__table">
            <thead class="settings__table-head">
              <tr class="settings__table-row">
                <th class="settings__table-cell">{{ lang('table.theads.date') }}</th>
                <th class="settings__table-cell">{{ lang('table.theads.actions') }}</th>
              </tr>
            </thead>
            <tbody class="settings__table-body">
              <tr
                v-for="timestamp in backups"
                :key="timestamp"
                class="settings__table-row"
              >
                <td class="settings__table-cell">
                  {{ new Date(timestamp).toLocaleDateString(localeIntlCodes[langSelectorConfig.locale.value], dateConfig) }}
                </td>
                <td class="settings__table-cell">
                  <Button
                    size="small"
                    :label="lang('restore')"
                    @click="backupRestore(timestamp)"
                  />
                  <Button
                    size="small"
                    :label="lang('delete')"
                    @click="backupDelete(timestamp)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section class="settings__section" >
          <h2 class="settings__section-heading">
            {{ `${lang('headings.users')}${!isAdmin ? `: ${users?.[0].email}` : ''}` }}
          </h2>
          <table
            v-if="users.length"
            class="settings__table"
          >
            <thead class="settings__table-head">
              <tr class="settings__table-row">
                <th class="settings__table-cell">{{ lang('table.theads.id') }}</th>
                <th class="settings__table-cell">{{ lang('table.theads.login') }}</th>
                <th class="settings__table-cell">{{ lang('table.theads.email') }}</th>
                <th class="settings__table-cell">{{ lang('table.theads.role') }}</th>
                <th class="settings__table-cell">{{ lang('table.theads.actions') }}</th>
              </tr>
            </thead>
            <tbody class="settings__table-body">
              <tr
                v-for="user in users"
                :key="user._id"
                class="settings__table-row"
              >
                <td class="settings__table-cell">
                  {{ user._id }}
                </td>
                <td class="settings__table-cell">
                  {{ user.login }}
                </td>
                <td class="settings__table-cell">
                  {{ user.email }}
                </td>
                <td class="settings__table-cell">
                  {{ user.role }}
                </td>
                <td class="settings__table-cell">
                  <Button
                    v-if="user._id === authConfig.user?._id"
                    size="small"
                    :label="lang('editPassword')"
                    @click="changePassword(user)"
                  />
                  <Button
                    v-if="user.role !== 'admin'"
                    size="small"
                    :label="lang('delete')"
                    @click="deleteUser(user)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section
          v-if="isAdmin"
          class="settings__section"
        >
          <h2 class="settings__section-heading">{{ lang('headings.createUser') }}</h2>
          <div class="settings__form">
            <Form
              :schema="userSchema"
              :isResetAfterSubmit="true"
              :style="{ gap: '0.5rem', display: 'flex', flexDirection: 'column', maxWidth: '50%' }"
              @formSubmit="createUser"
            />
          </div>
        </section>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { SyncResponse } from '~/types/Common'
import { UserCreating, UserResponse } from '~/types/User'
import { JSONSchema4 } from 'json-schema'
import { useLocales } from '~/hooks/useLocales'
import { localeIntlCodes } from '~/utils'
import userFormSchema from '~/schemas/userFormSchema.json'
import Preloader from '~/components/Preloader.vue'
import Button from '~/components/Button.vue'
import Dropdown from '~/components/Inputs/Dropdown.vue'
import Form from '~/components/Form.vue'
import api from '~/api'
import store from '~/store'

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
    const backups = reactive<number[]>([])
    const users = reactive<UserResponse[]>([])
    const isPageLoaded = ref(false)
    const isReloading = ref(false)
    const userSchema = userFormSchema as JSONSchema4
    const dateConfig = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    } as const

    const isAdmin = computed(() => (
      getters.authConfig.value.user?.role === 'admin'
    ))

    const langSelectorConfig = computed(() => ({
      locale: getters.currentLocale,
      options: [
        {
          path: 'languages.en',
          value: 'en',
          icon: 'flag-en'
        },
        {
          path: 'languages.by',
          value: 'by',
          icon: 'flag-by'
        }
      ]
    }))

    const setBackups = (data: string[]) => {      
      backups.length = 0
      backups.push(...data.map(Number))
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
      isReloading.value = true

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
      } finally {
        isReloading.value = false
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
      isReloading.value = true

      try {
        const response = await api.post<SyncResponse>('/api/sync')

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
        throw error
      } finally {
        isReloading.value = false
      }
    }

    const logout = async () => {
      try {
        await api.post('/api/users/logout')
        localStorage.removeItem('token')
        actions.setAuthConfig('user', undefined)
        actions.setAuthConfig('isAuthenticated', false)
      } catch (error) {
        console.error(error)
      }
    }

    const createUser = async (payload: UserCreating) => {
      if (payload.password !== payload.passwordConfirm) {
        return actions.setSnackbarMessage({
          message: lang('userForm.errors.passwordsDoNotMatch'),
          type: 'error',
          time: 5000
        })
      }

      try {
        const { status, data } = await api.post<UserResponse>('/api/users/registration', payload)
        if (status !== 201) {
          throw new Error('Something went wrong')
        }

        actions.setSnackbarMessage({
          message: lang('userForm.created'),
          type: 'success',
          time: 5000
        })

        users.push(data)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get<UserResponse[]>('/api/users')
        users.length = 0
        users.push(...response.data.sort((a, b) => a.role.localeCompare(b.role)))
      } catch (error) {
        console.error(error)
      }
    }

    const changePassword = async (user: UserResponse) => {
      console.log(user)
    }

    const deleteUser = async (user: UserResponse) => {
      isReloading.value = true
      try {
        await api.delete(`/api/users/${user._id}`)
        await fetchUsers()
      } catch (error) {
        console.error(error)
      } finally {
        isReloading.value = false
      }
    }

    onMounted(() => {
      if (isAdmin.value) {
        Promise.all([fetchBackups, fetchUsers].map((fn) => fn()))
          .then(() => isPageLoaded.value = true)
          .catch(console.error)
      } else if (getters.authConfig.value.user) {
        isPageLoaded.value = true
        users.push(getters.authConfig.value.user)
      }
    })

    return {
      lang,
      isAdmin,
      dateConfig,
      allLocales,
      setLocale,
      isPageLoaded,
      backups,
      users,
      changePassword,
      deleteUser,
      createBackups,
      backupRestore,
      backupDelete,
      syncCollection,
      isReloading,
      langSelectorConfig,
      authConfig: getters.authConfig,
      localeIntlCodes,
      userSchema,
      createUser,
      logout
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/scss/variables';

.settings {
  padding: $mainPadding;

  &__actions {
    margin-bottom: $mainPadding;
    display: flex;
    gap: 0.5rem;
  }

  &__section {
    width: 50%;
    margin-bottom: $mainPadding;

    &-heading {
      @include serif(1.75rem);
      margin-bottom: .5rem;
    }
  }

  &__table {
    width: 100%;

    &-head {
      border-bottom: 2px solid $paleDP;
    }

    &-row {
      border-bottom: 1px solid $paleMD;

      &:last-child {
        border-bottom: 0;
      }
    }

    &-cell {
      padding: 5px 10px;
      border-right: 1px solid $paleMD;

      &:first-child {
        padding-left: 0;
        font-weight: 600;
        width: 100%;
      }

      &:last-child {
        padding-right: 0;
        border-right: 0;
        white-space: nowrap;
      }

      .button {
        &:not(:first-of-type) {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>
