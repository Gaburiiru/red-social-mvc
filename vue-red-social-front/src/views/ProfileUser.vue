<template>
  <div v-if="userData !== '' && userData !== undefined">
    <UserProfile :userData="userData" />
  </div>
</template>
  
<script>
import index from "@/store/index";
import post from "@/store/post";
import UserProfile from "@/components/UserProfile.vue";
import router from "@/router";
export default {
  async mounted() {
    await post.dispatch("loadPost");
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    userData() {
      if (index.state.userSearch === "") {
        router.push("/search");
      } else {
        return index.state.userSearch;
      }
    },
  },
  methods: {},
  components: {
    UserProfile,
  },
};
</script>