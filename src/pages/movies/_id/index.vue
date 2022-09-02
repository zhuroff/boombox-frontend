<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!moviePage.isFetched" mode="light" />
    </transition>

    <transition-group name="flyUp">
      <div v-if="moviePage.isFetched">
        <h1>{{ moviePage.data.name }} {{ moviePage.data.mime_type }}</h1>
        <VuePlyr>
          <video
            controls
            crossorigin
            playsinline
            :src="moviePage.data.file"
            :type="moviePage.data.mime_type"
          />
        </VuePlyr>
      </div>
    </transition-group>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import AppPreloader from "~/components/Preloader/Preloader.vue";
import MoviesServices from "~/services/MoviesServices";

export default defineComponent({
  components: {
    AppPreloader,
  },

  setup() {
    const route = useRoute();

    const moviePage = reactive({
      isFetched: false,
      data: {} as any,
    });

    const setMovieState = (data: any) => {
      moviePage.data = data;
      moviePage.isFetched = true;
    };

    const fetchMoviePage = () => {
      MoviesServices.movie(String(route.params.id), String(route.query.path))
        .then((data) => setMovieState(data))
        .catch((error) => console.dir(error));
    };

    onMounted(() => fetchMoviePage());

    return {
      moviePage,
    };
  },
});
</script>
