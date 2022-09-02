<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader v-if="!moviesList.isFetched" mode="light" />
    </transition>
    <transition-group name="flyUp">
      <ul v-if="moviesList.isFetched">
        <li v-for="movie in moviesList.data" :key="movie.resource_id">
          <router-link
            :to="{
              path: `/movies/${movie.resource_id.split(':')[1]}`,
              query: { path: movie.path },
            }"
          >
            <div>{{ movie.name }}</div>
          </router-link>
        </li>
      </ul>
    </transition-group>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { RequestConfig, TPagination } from "~/types/Global";
import AppPreloader from "~/components/Preloader/Preloader.vue";
import MoviesServices from "~/services/MoviesServices";

export default defineComponent({
  components: {
    AppPreloader,
  },

  setup() {
    const route = useRoute();

    const moviesList = reactive({
      isFetched: false,
      data: [] as any,
      pagination: {} as TPagination,
    });

    const pageConfig = reactive<RequestConfig>({
      page: Number(route.query.p) || 1,
      sort: { title: 1 },
      limit: 10,
    });

    const setFetchedData = (data: any[]) => {
      moviesList.data.push(...data);
      moviesList.isFetched = true;
    };

    const fetchMovies = () => {
      MoviesServices.list(pageConfig)
        .then((response) => setFetchedData(response))
        .catch((error) => console.dir(error));
    };

    onMounted(() => fetchMovies());

    return {
      moviesList,
    };
  },
});
</script>
