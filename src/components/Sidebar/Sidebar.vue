<template>
  <aside :class="[{ '--opened': isExpanded }, 'aside']">
    <ButtonBurger
      :isActive="isExpanded"
      @burgerClick="burgerClick"
    />
    <router-link
      class="aside__homelink"
      to="/"
      @click="burgerClick"
    >
      <Sprite name="vinyl" />
      <span>MelodyMap</span>
    </router-link>
    <nav class="aside__nav">
      <ul class="aside__nav-list">
        <li
          v-for="(item, index) in navbar"
          :key="index"
          class="aside__nav-item"
        >
          <router-link
            :to="`/${item.route}`"
            class="aside__nav-link"
            @click="burgerClick"
          >{{ item.title }}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import router from "~/router";
import ButtonBurger from "~/components/Button/ButtonBurger.vue";
import Sprite from "~/components/Sprite/Sprite.vue";
import { RouteRecordName } from "vue-router";
import "./Sidebar.scss";

export default defineComponent({
  components: {
    ButtonBurger,
    Sprite,
  },

  props: {
    isExpanded: {
      type: Boolean,
      required: true,
    },
  },

  setup(_, { emit }) {
    const navbar = reactive<
      {
        title: RouteRecordName | undefined;
        route: string;
      }[]
    >([]);

    const burgerClick = () => {
      emit("burgerClick");
    };

    onMounted(() => {
      navbar.push(
        ...router
          .getRoutes()
          // .filter(({ path }) => !path.includes(":id") && path !== "/")
          .filter(({ path }) => ![':id', ':genre'].some((slug) => path.includes(slug)) && path !== "/")
          .map(({ name, path }) => ({ title: name, route: path.replace("/", "") }))
      );
    });

    return {
      navbar,
      burgerClick,
    };
  },
});
</script>
