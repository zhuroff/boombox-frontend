<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!isPageLoaded || !isSynchronized"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition name="flyUp">
        <div
          v-if="isPageLoaded"
          class="backups"
        >
          <Button
            text="Create backup"
            @onClick="createBackups"
          />

          <ul>
            <li
              v-for="item in backups"
              :key="item.timestamp"
            >
              <span>{{ item.dateCreation }}</span>
              <button @click="backupRestore(item.timestamp)">Restore</button>
              <button @click="backupDelete(item.timestamp)">Delete</button>
            </li>
          </ul>

          <Button
            text="Synchronize"
            @onClick="synchronizeCollection"
          />
        </div>
      </transition>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import Button from '~/components/Button/Button.vue'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import api from '~/api'

interface BackupList {
  timestamp: number
  dateCreation: string
}

export default defineComponent({
  components: {
    Button,
    AppPreloader
  },

  setup() {
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
        const response = await api.get('/api/backup/list')

        if (response) setBackups(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const createBackups = async () => {
      try {
        const response = await api.post('/api/backup/save')
        if (response) fetchBackups()
      } catch (error) {
        console.error(error)
      }
    }

    const backupRestore = async (timestamp: number) => {
      try {
        const response = await api.post(`/api/backup/restore/${timestamp}`)
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const backupDelete = async (timestamp: number) => {
      // try {
      //   const response = await api.delete(`/api/backup/${timestamp}`)
      //   console.log(response.data)
      //   fetchBackups()
      // } catch (error) {
      //   console.error(error)
      // }
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

    // const cleanAlbums = async () => {
    //   try {
    //     const response = await api.post('/api/backup/clean')
    //     console.log(response)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }

    fetchBackups()
    // cleanAlbums()

    return {
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

