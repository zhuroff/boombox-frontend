<template>
  <section class="section">
    <AppButton
      text="Create backup"
      @onClick="createBackups"
    />
  </section>
</template>

<script lang="ts">

import { defineComponent, reactive } from 'vue'
import AppButton from '~/components/AppButton.vue'
import api from '~/api'

export default defineComponent({
  components: {
    AppButton
  },

  setup() {
    const backups = reactive([])

    const fetchBackups = async () => {
      try {
        const response = await api.get('/api/backup/list')
        console.log(response)
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
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }

    // fetchBackups()

    return {
      backups,
      createBackups
    }
  }
})

</script>

