<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import MoviesList from "./list/index.vue";
import MoviePage from "./_id/index.vue";

export default defineComponent({
  components: {
    MoviesList,
    MoviePage,
  },

  setup() {
    const route = useRoute();

    const routeComponent = computed(() => {
      if (route.name === "Movies") {
        return MoviesList;
      }

      return MoviePage;
    });

    return { routeComponent };
  },
});
</script>
