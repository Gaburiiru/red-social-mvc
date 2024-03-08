import Vue from "vue";
import Vuex from "vuex";
import post from "@/store/post";
import router from "@/router";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: "",
    userSearch: "",
  },
  getters: {},
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setUserSearch(state, data) {
      state.userSearch = data;
    },
  },
  actions: {
    userSession(state, user) {
      localStorage.setItem("name", user.name);
      localStorage.setItem("pass", user.pass);
      localStorage.setItem("img", user.img);
      localStorage.setItem("follower", user.follower);
      localStorage.setItem("following", user.following);
      localStorage.setItem("id", user.id);
      state.commit("setUser", user);
      router.push("/");
    },

    initializeSession({ commit }) {
      const name = localStorage.getItem("name");
      const pass = localStorage.getItem("pass");
      const img = localStorage.getItem("img");
      const follower = localStorage.getItem("follower");
      const following = localStorage.getItem("following");
      const id = localStorage.getItem("id");
      if (
        name !== null &&
        pass !== null &&
        img !== null &&
        id !== null &&
        follower !== null &&
        following !== null
      ) {
        commit("setUser", {
          name: name,
          pass: pass,
          img: img,
          follower: follower,
          following: following,
          id: id,
        });
      }
    },

    async newUser(state, user) {
      return new Promise(async (resolve, reject) => {
        try {
          let item = await post.state.service.postUser(user);
          const users = post.state.allUser;
          users.push(item);

          post.commit("setAllUser", users);

          state.dispatch("userSession", item);
          resolve(true);
        } catch (error) {
          console.log("Error service", error);
          reject(error);
        }
      });
    },

    signOutUser(state) {
      localStorage.removeItem("name");
      localStorage.removeItem("pass");
      localStorage.removeItem("img");
      localStorage.removeItem("follower");
      localStorage.removeItem("following");
      localStorage.removeItem("id");
      state.commit("setUser", "");
    },
  },
  modules: {},
});
