<template>
  <UserProfile :userData="userData" />
</template>

<script>
import index from "@/store/index";
import post from "@/store/post";
import UserProfile from "@/components/UserProfile.vue";
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
      return index.state.user;
    },
  },
  methods: {},
  components: {
    UserProfile,
  },
};
</script>