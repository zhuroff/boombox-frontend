<template>
  <Component :is="routeComponent" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import UndisposedList from "./list/index.vue";
import UndisposedPage from "./_id/index.vue";

export default defineComponent({
  components: {
    UndisposedList,
    UndisposedPage,
  },

  setup() {
    const route = useRoute();

    const routeComponent = computed(() => {
      if (route.name === "Undisposed") {
        return UndisposedList;
      }

      return UndisposedPage;
    });

    return { routeComponent };
  },
});
</script>
