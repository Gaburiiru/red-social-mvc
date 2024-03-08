<template>
  <v-app>
    <Navbar v-if="isLoged() !== ''" />
    <v-main style="background-color: black">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import index from "@/store/index";
import Navbar from "@/components/Navbar.vue";
export default {
  name: "App",
  data: () => ({
    //
  }),
  components: {
    Navbar,
  },
  methods: {
    isLoged() {
      return index.state.user;
    },
  },
};
</script>
