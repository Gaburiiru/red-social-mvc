<template>
  <v-card class="mx-auto">
    <v-navigation-drawer
      permanent
      app
      :width="isSmallScreen ? 60 : 80"
      dark
      color="black"
    >
      <v-list nav dense shaped>
        <v-list-item-group color="primary">
          <v-list-item v-if="this.$route.path !== '/profile'" to="/profile">
            <v-list-item-content>
              <v-img
                class="mx-auto rounded-pill"
                :width="isSmallScreen ? '25' : '35'"
                :src="userData.img"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="this.$route.path !== '/'" to="/">
            <v-list-item-content>
              <v-img
                class="mx-auto rounded-pill"
                :width="isSmallScreen ? '25' : '35'"
                src="../assets/img/SocialWaveIcon.png"
              />
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="
              this.$route.path !== '/profile' &&
              this.$route.path !== '/search' &&
              this.$route.path !== '/ProfileUser'
            "
            @click="publicPost"
          >
            <v-list-item-content>
              <v-list-item-icon>
                <v-icon class="mx-auto" :size="isSmallScreen ? 25 : 35"
                  >fas fa-plus-circle</v-icon
                >
              </v-list-item-icon>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/search" v-if="this.$route.path !== '/search'">
            <v-list-item-content>
              <v-list-item-icon>
                <v-icon class="mx-auto" :size="isSmallScreen ? 25 : 35"
                  >fas fa-search</v-icon
                >
              </v-list-item-icon>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/login" @click="signOut">
            <v-list-item-content>
              <v-list-item-icon>
                <v-icon class="mx-auto" :size="isSmallScreen ? 25 : 35"
                  >fas fa-sign-out-alt</v-icon
                >
              </v-list-item-icon>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>
<script>
import post from "@/store/post";
import index from "@/store/index";
export default {
  data: () => ({ isSmallScreen: false }),
  methods: {
    publicPost() {
      post.commit("setOpenPublic", true);
    },
    signOut() {
      index.dispatch("signOutUser");
    },
  },
  mounted() {
    this.isSmallScreen = window.innerWidth < 600;
  },
  computed: {
    userData() {
      return index.state.user;
    },
  },
};
</script>