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
        <div class="backups__actions">
          <Button
            :text="lang('settings.createBackup')"
            @onClick="createBackups"
          />
          <Button
            :text="lang('settings.synchronize')"
            @onClick="synchronizeCollection"
          />
          <Button
            v-for="locale in allLocales"
            :key="locale"
            :text="lang(`languages.${locale}`)"
            @onClick="setLocale(locale)"
          />
        </div>

        <table class="backups__table">
          <tbody class="backups__table-body">
            <tr
              v-for="item in backups"
              :key="item.timestamp"
              class="backups__table-row"
            >
              <td class="backups__table-cell">{{ item.dateCreation }}</td>
              <td class="backups__table-cell">
                <Button
                  text="Restore"
                  mode="text"
                  @onClick="backupRestore(item.timestamp)"
                />
              </td>
              <td class="backups__table-cell">
                <Button
                  text="Delete"
                  mode="text"
                  @onClick="backupDelete(item.timestamp)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">

import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import { useLocales } from '~/hooks/useLocales'
import Button from '~/components/Button/Button.vue'
import Preloader from '~/components/Preloader.vue'
import api from '~/api'

interface BackupList {
  timestamp: number
  dateCreation: string
}

export default defineComponent({
  components: {
    Button,
    Preloader
  },

  setup() {
    const { allLocales, setLocale, lang } = useLocales()
    const store = useStore(key)
    const backups = reactive([]) as unknown as BackupList[]
    const isPageLoaded = ref(false)
    const isSynchronized = ref(true)

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
        console.dir(error)
      }
    }

    const createBackups = async () => {
      try {
        const response = await api.post('/api/backup/save')
        
        if (response.status === 201) {
          store.commit('setSnackbarMessage', {
            message: response.data.message,
            type: 'success'
          })

          fetchBackups()
        }
      } catch (error) {
        console.dir(error)
      }
    }

    const backupRestore = async (timestamp: number) => {
      try {
        const response = await api.post(`/api/backup/restore/${timestamp}`)
        
        if (response.status === 201) {
          store.commit('setSnackbarMessage', {
            message: response.data.message,
            type: 'success'
          })

          fetchBackups()
        }
      } catch (error) {
        console.dir(error)
      }
    }

    const backupDelete = async (timestamp: number) => {
      try {
        const response = await api.delete(`/api/backup/${timestamp}`)

        if (response.status === 201) {
          store.commit('setSnackbarMessage', {
            message: response.data.message,
            type: 'success'
          })

          fetchBackups()
        }

      } catch (error) {
        console.dir(error)
      }
    }

    const synchronizeCollection = async () => {
      isSynchronized.value = false

      try {
        const response = await api.post('/api/sync')
        isSynchronized.value = true

        if (response.status === 200) {
          store.commit('setSnackbarMessage', {
            message: response.data.message,
            type: 'success'
          })
        }
      } catch (error) {
        isSynchronized.value = true
        throw error
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
      synchronizeCollection,
      isSynchronized
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

    .button {
      margin-right: 10px;
    }
  }

  &__table {
    width: 100%;

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
        width: 100%;
        padding-left: 0;
        font-weight: 600;
      }

      &:last-child {
        padding-right: 0;
        border-right: 0;
      }
    }
  }
}

</style>
