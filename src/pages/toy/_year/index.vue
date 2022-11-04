<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!toyYear.isFetched" mode="light" />
    </transition>

    <transition name="flyUp">
      <div>
        <h1>{{ year?.name }}</h1>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import api from '~/api'
import { PropType, defineComponent, reactive, watchEffect } from 'vue'
import { TTOYEntity } from '~/types/TOY'
import AppPreloader from '~/components/Preloader/Preloader.vue'

export default defineComponent({
  components: {
    AppPreloader
  },

  props: {
    year: {
      type: Object as PropType<TTOYEntity>,
      required: false
    },
  },

  setup(props) {
    const toyYear = reactive<any>({
      isFetched: false,
      data: {}
    })

    const fetchYearContent = async () => {
      try {
        const response = await api.post<any[]>('/api/toy', { path: props.year?.path, dirOnly: false })

        if (response?.status === 200) {
          toyYear.data = response?.data
          toyYear.isFetched = true
          console.log(toyYear.data)
        }
      } catch (error) {
        throw error
      }
    }

    watchEffect(() => {
      toyYear.isFetched = false
      fetchYearContent()
    })

    return {
      toyYear
    }
  }
})
</script>
