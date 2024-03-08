<template>
  <v-container>
    <v-col cols="12">
      <v-card dark class="ma-2 mx-auto rounded-xl" max-width="800px" hover>
        <v-col cols="12" class="ma-0 my-auto">
          <h2 class="pl-2 pb-2">{{ this.$tc("Search.title") }}</h2>
          <v-text-field
            v-on:keyup="searchFilter"
            v-model="search"
            solo
            placeholder="🔎 filtra nombre"
            flat
          />
        </v-col>
      </v-card>
      <v-list rounded dark class="mx-auto rounded-xl" max-width="800px" hover>
        <v-subheader>Usuarios</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="item in filteredUsers"
            :key="item.id"
            @mouseenter="createObjet(item.id, true)"
            @mouseleave="deleteObjet(item.id, false)"
            @click="userClick(item)"
          >
            <v-list-item-content>
              <v-list-item-title class="text-capitalize">{{
                item.name
              }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon
              v-if="showButton[item.id]"
              class="pa-0 ma-0 my-auto"
            >
              <v-icon size="25" class="pa-0 ma-0">fas fa-user-circle</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
  </v-container>
</template>
<script>
import post from "@/store/post";
import index from "@/store/index";
import router from "@/router";
export default {
  data() {
    return {
      search: "",
      showButton: [],
    };
  },
  mounted() {
    post.dispatch("loadUser");
  },
  methods: {
    searchFilter() {
      post.dispatch("searchFilter", this.search).then(() => {});
    },
    createObjet(index, value) {
      this.$set(this.showButton, index, value);
    },
    deleteObjet(index) {
      this.$delete(this.showButton, index);
    },
    userClick(user) {
      router.push("ProfileUser");
      index.commit("setUserSearch", user);
    },
  },
  computed: {
    filteredUsers() {
      return post.getters.userFilter;
    },
  },
};
</script>

<style>
.v-text-field__details {
  display: none;
}

.v-input__slot {
  margin: 0;
}
</style>