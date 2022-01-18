<template>
  <section class="section">
    <AppButton
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
  </section>
</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import AppButton from '~/components/AppButton.vue'
import api from '~/api'

interface BackupList {
  timestamp: number
  dateCreation: string
}

export default defineComponent({
  components: {
    AppButton
  },

  setup() {
    const backups = reactive([]) as unknown as BackupList[]

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
    }

    const fetchBackups = async () => {
      try {
        const response = await api.get('/api/backup/list')
        setBackups(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const createBackups = async () => {
      try {
        const response = await api.post('/api/backup/save')

        if (response) {
          fetchBackups()
        }
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
      try {
        const response = await api.delete(`/api/backup/${timestamp}`)
        console.log(response.data)
        fetchBackups()
      } catch (error) {
        console.error(error)
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
      backups,
      createBackups,
      backupRestore,
      backupDelete
    }
  }
})

</script>

