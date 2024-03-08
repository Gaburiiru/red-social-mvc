import Vue from "vue";
import Vuex from "vuex";
import postService from "@/services/postService";
import index from "@/store/index";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    service: new postService(),
    allPost: [],
    allComent: [],
    allUser: [],
    edit: {},
    openForm: false,
    openPublic: false,
    search: "",
  },
  getters: {
    userFilter(state) {
      let userFilter = [];
      for (let user of state.allUser) {
        let name = (user.name || "").toLowerCase();
        if (name.indexOf(state.search) >= 0) {
          userFilter.push(user);
        }
      }
      return userFilter;
    },
  },
  mutations: {
    setAllPost(state, data) {
      state.allPost = data;
    },
    setAllComent(state, data) {
      state.allComent = data;
    },
    setAllUser(state, data) {
      state.allUser = data;
    },
    setOpenForm(state, data) {
      state.openForm = data;
    },
    setOpenPublic(state, data) {
      state.openPublic = data;
    },
    updateSearch(state, payload) {
      state.search = payload;
    },
  },
  actions: {
    searchFilter(context, payload) {
      context.commit("updateSearch", payload.toLowerCase());
    },

    async loadPost(state) {
      return new Promise(async (resolve, reject) => {
        try {
          let item = await state.state.service.getPost();
          state.commit("setAllPost", item.reverse());
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    postPost(state, postNew) {
      return new Promise(async (resolve, reject) => {
        try {
          const objectPost = {
            description: postNew.description,
            img: postNew.img,
            like: postNew.like,
            title: postNew.title,
            userId: postNew.userId,
          };

          const posts = state.state.allPost;
          posts.unshift(objectPost);

          await state.state.service.postPost(objectPost);
          state.commit("setAllPost", posts);
          state.commit("setOpenPublic", false);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    putPost(state, postUpdate) {
      return new Promise(async (resolve, reject) => {
        try {
          const updatedPosts = state.state.allPost.map((element) => {
            if (element.id === postUpdate.id) {
              return postUpdate;
            }
            return element;
          });

          state.commit("setAllPost", updatedPosts);

          const updatedPost = updatedPosts.find(
            (post) => post.id === postUpdate.id
          );
          await state.state.service.putPost(updatedPost);

          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    deletePost(state, post) {
      return new Promise(async (resolve, reject) => {
        try {
          await state.state.service.deletePost(post);
          let newArray = state.state.allPost.filter(
            (element) => element.id !== post.id
          );
          state.commit("setAllPost", newArray);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    likedPostState(state, { postId, value }) {
      return new Promise(async (resolve, reject) => {
        try {
          const updatedPosts = state.state.allPost.map((element) => {
            if (element.id === postId) {
              return {
                ...element,
                like: element.like + value,
              };
            }
            return element;
          });

          state.commit("setAllPost", updatedPosts);

          const updatedPost = updatedPosts.find((post) => post.id === postId);

          await state.state.service.putPost(updatedPost);

          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    async loadComent(state) {
      return new Promise(async (resolve, reject) => {
        try {
          let item = await state.state.service.getComent();
          state.commit("setAllComent", item);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    postComent(state, { coment, userId, id }) {
      return new Promise(async (resolve, reject) => {
        try {
          const objectComent = {
            postId: id,
            userId: userId,
            coment: coment,
          };
          const coments = state.state.allComent;
          coments.push(objectComent);

          await state.state.service.postComent(objectComent);
          state.commit("setAllComent", coments);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    deleteComent(state, coment) {
      console.log(coment);
      return new Promise(async (resolve, reject) => {
        try {
          await state.state.service.deleteComent(coment);
          let newArray = state.state.allComent.filter(
            (element) => element.id !== coment.id
          );
          state.commit("setAllComent", newArray);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    async loadUser(state) {
      return new Promise(async (resolve, reject) => {
        try {
          let item = await state.state.service.getUser();
          state.commit("setAllUser", item);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    putUserProfile({ state, commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const updatedUsers = this.state.allUser.map((element) => {
            if (element.id === payload.userOther.id) {
              return {
                ...element,
                follower: element.follower + payload.value,
              };
            } else if (element.id === parseInt(payload.user.id)) {
              return {
                ...element,
                following: element.following + payload.value,
              };
            }
            return element;
          });

          this.commit("setAllUser", updatedUsers);
          const updatedUserPost = updatedUsers.find(
            (user) => user.id === payload.userOther.id
          );
          const updatedUser = updatedUsers.find(
            (userSearch) => userSearch.id === parseInt(payload.user.id)
          );
          await this.state.service.putUser(updatedUserPost);
          await this.state.service.putUser(updatedUser);
          localStorage.setItem("following", updatedUser.following);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
    putUser(state, { userPost, user, value }) {
      console.log("store", userPost);
      console.log("store", user);
      return new Promise(async (resolve, reject) => {
        try {
          const updatedUsers = state.state.allUser.map((element) => {
            if (element.id === userPost.id) {
              return {
                ...element,
                follower: element.follower + value,
              };
            } else if (element.id === parseInt(user.id)) {
              return {
                ...element,
                following: element.following + value,
              };
            }
            return element;
          });

          state.commit("setAllUser", updatedUsers);
          console.log(state.state.allUser);
          const updatedUserPost = updatedUsers.find(
            (user) => user.id === userPost.id
          );
          const updatedUser = updatedUsers.find(
            (userSearch) => userSearch.id === parseInt(user.id)
          );
          await state.state.service.putUser(updatedUserPost);
          await state.state.service.putUser(updatedUser);
          localStorage.setItem("following", updatedUser.following);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
  modules: {},
});
