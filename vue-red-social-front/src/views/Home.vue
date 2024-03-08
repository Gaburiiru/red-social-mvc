<template>
  <v-container>
    <v-col cols="12" v-for="(post, index) in getAllPost" :key="index">
      <v-card dark class="mx-auto rounded-xl" max-width="500px" hover>
        <v-row class="justify-start pa-2 ma-0 align-center">
          <v-col
            cols="1"
            class="pa-0 ma-0"
            @mouseenter="createObjet(index, true)"
            @mouseleave="deleteObjet(index, false)"
          >
            <v-speed-dial
              v-model="fab"
              :bottom="bottom"
              :right="right"
              :left="left"
              :top="top"
              :direction="direction"
              :open-on-hover="hover"
              :transition="transition"
            >
              <template v-slot:activator>
                <v-img
                  v-model="fab"
                  width="30px"
                  class="pa-0 ma-0 rounded-xl mx-auto"
                  :src="user(post.userId).img"
                />
              </template>
              <v-sheet
                class="pa-2 ma-n4 rounded-xl d-flex"
                style="width: 200px"
                color="primary"
                v-if="showButtons[index]"
              >
                <p class="my-auto mx-auto">
                  Seguir a <strong>{{ user(post.userId).name }}</strong>
                </p>
                <v-btn
                  fab
                  x-small
                  color="white"
                  class="mx-auto pa-0 ma-0 primary--text"
                  @click="follow(user(post.userId), userData)"
                >
                  <v-icon size="18">fas fa-user-plus</v-icon>
                </v-btn>
              </v-sheet>
            </v-speed-dial>
          </v-col>
          <v-col class="pa-0 ma-0">
            <h4 class="pa-0 ma-0 mx-2 my-auto">
              {{ user(post.userId).name }}
            </h4>
          </v-col>
        </v-row>
        <v-img
          loading="lazy"
          class="mx-auto"
          max-width="500px"
          max-height="300px"
          :src="post.img"
          @click="clickPost(post)"
        />
        <h2
          class="text-center pa-2"
          :class="isSmallScreen ? 'text-subtitle-1' : ''"
        >
          {{ post.title }}
        </h2>
        <v-btn @click="likedPost(post.id)" fab plain>
          {{ post.like
          }}<v-icon :class="iconn(post.id)" class="ml-1" color="red" />
        </v-btn>
        <v-btn @click="openSheet(post.id, (postSelected = post))" fab plain>
          {{ lengthComentPost(post.id) }}
          <v-icon class="ml-1">far fa-comment</v-icon>
        </v-btn>
      </v-card>
    </v-col>
    <!-- bottom sheets comentarios -->
    <v-bottom-sheet dark v-model="sheet" v-if="sheet && postSelected" inset>
      <v-card class="rounded-t-xl mx-auto">
        <v-btn
          class="mt-2 mx-auto d-flex"
          text
          color="red"
          plain
          @click="closeSheet"
          fab
        >
          <v-icon>far fa-times-circle</v-icon>
        </v-btn>
        <v-sheet
          class="text-center rounded-t-lg overflow-y-auto"
          max-height="400"
        >
          <v-row
            v-for="(coment, index) in comentPost"
            :key="index"
            class="px-2 ma-0 align-start lighten-1 rounded-xl mx-2 mb-1"
          >
            <v-col class="pa-0 ma-0" cols="1">
              <v-img
                width="30"
                class="rounded-pill mx-auto"
                :src="user(coment.userId).img"
              />
            </v-col>
            <v-col cols="1" class="pa-0 ma-0 d-flex justify-start ml-1 mt-1">
              <h4 class="white--text font-weight-medium text-capitalize">
                {{ user(coment.userId).name }}
              </h4>
            </v-col>
            <v-col class="pa-0 ma-0">
              <p class="font-italic ml-1 mt-1 d-flex ma-auto">
                .{{ coment.coment }}
              </p>
            </v-col>
            <v-col
              cols="1"
              class="pa-0 ma-0 mt-1"
              v-if="parseInt(userData.id) === coment.userId"
            >
              <v-btn
                @click="deleteComent(coment)"
                plain
                fab
                x-small
                class="align-start"
              >
                <v-icon hover>fas fa-trash</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-sheet>
        <v-row class="justify-space-around pl-4 pr-4 ma-0 mt-4">
          <v-text-field
            placeholder="Ingrese un comentario..."
            solo
            class="ml-2 font-italic"
            v-model="textComent"
            rounded
            dense
          />
          <v-btn
            class="ml-2 mt-1"
            fab
            small
            color="primary"
            plain
            @click="sendComentPost(textComent, postSelected.id)"
          >
            <v-icon>fas fa-chevron-circle-right</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-bottom-sheet>
    <!-- modal public post -->
    <v-dialog v-model="openPublic" v-if="openPublic" max-width="500" persistent>
      <v-card class="text-center rounded-xl" dark>
        <v-container>
          <v-icon class="pt-1" color="red" @click="closePublic">
            fas fa-times-circle
          </v-icon>
          <h3 class="my-2">{{ this.$tc("Public.title") }}</h3>
          <v-divider />
          <v-text-field
            v-model="namePublic"
            :label="this.$tc('Public.inputName')"
            :rules="[rules.required, rules.min]"
            outlined
            dense
            rounded
            counter
            class="mx-2 mt-4"
          />
          <v-textarea
            v-model="bodyPublic"
            :label="this.$tc('Public.inputArea')"
            :rules="[rulesArea.required, rulesArea.min]"
            outlined
            dense
            rounded
            counter
            class="mx-2"
          />
          <v-file-input
            v-model="filePublic"
            counter
            :label="this.$tc('Public.inputFile')"
            class="mx-3"
            outlined
            dense
            rounded
            :rules="[rules.required]"
            accept="image/*"
            @change="searchImg(filePublic)"
          />
          <v-row class="justify-center pa-4">
            <v-btn
              color="primary"
              rounded
              :disabled="validatePost()"
              @click="submitPost()"
            >
              {{ this.$tc("Public.buttons.submit") }}
              <v-icon class="ml-2" size="15">fas fa-upload</v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- alert public -->
    <v-snackbar :color="color" v-model="snackbar">
      {{ textSnackbar }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" fab text v-bind="attrs" @click="snackbar = false">
          <v-icon>fas fa-times-circle</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- click post -->
    <v-dialog
      v-model="dialogPost"
      v-if="dialogPost && selectedPost"
      max-width="500"
      persistent
    >
      <v-card class="text-center rounded-xl" dark>
        <v-container>
          <v-row class="justify-space-between pa-3 pb-6 align-center">
            <v-row class="pl-4">
              <img
                width="30"
                class="rounded-pill"
                :src="user(selectedPost.userId).img"
              />
              <p class="my-auto px-2">
                {{ user(selectedPost.userId).name }}
              </p>
            </v-row>
            <v-icon class="" color="red" @click="closePost">
              fas fa-times-circle
            </v-icon>
          </v-row>
          <v-img class="rounded-xl" :src="selectedPost.img">
            <v-card
              id="card"
              width="max-content"
              style="position: absolute; bottom: 0%; width: 100%"
            >
              <h3 class="ma-4" style="text-shadow: #131313 1px 0 10px">
                {{ selectedPost.title }}
              </h3>
              <v-card-text
                class="white--text font-italic pt-0"
                style="text-shadow: #131313 1px 0 10px"
              >
                {{ selectedPost.description }}
              </v-card-text>
            </v-card>
          </v-img>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import post from "@/store/post";
import index from "@/store/index";
export default {
  data() {
    return {
      newPost: [],
      sheet: false,
      postId: null,
      click: {},
      icon: "",
      postSelected: null,
      textComent: "",
      namePublic: "",
      bodyPublic: "",
      filePublic: null,
      rules: {
        required: (v) => !!v || this.$tc("Public.validation.requerid"),
        min: (v) =>
          (v.length >= 5 && v.length <= 100) ||
          this.$tc("Public.validation.minAndMax"),
      },
      rulesArea: {
        required: (v) => !!v || this.$tc("Public.validation.requerid"),
        min: (v) =>
          (v.length >= 5 && v.length <= 300) ||
          this.$tc("Public.validation.minAndMaxArea"),
      },
      imageObjet: null,
      imageTemp: null,
      snackbar: false,
      textSnackbar: "",
      color: null,
      dialogPost: false,
      selectedPost: null,
      dialogFollower: false,
      isSmallScreen: false,
      direction: "right",
      fab: false,
      fling: false,
      hover: true,
      tabs: null,
      right: false,
      bottom: false,
      left: false,
      top: false,
      transition: "scale-transition",
      showButtons: [],
    };
  },
  name: "Home",
  components: {},
  mounted() {
    post.dispatch("loadPost");
    post.dispatch("loadComent");
    post.dispatch("loadUser");
    this.isSmallScreen = window.innerWidth < 600;
  },
  computed: {
    getAllPost() {
      return post.state.allPost;
    },
    getAllComent() {
      return post.state.allComent;
    },
    getAllUser() {
      return post.state.allUser;
    },
    comentPost() {
      return this.getAllComent.filter(
        (coment) => coment.postId === this.postId
      );
    },
    openPublic() {
      return post.state.openPublic;
    },
    userData() {
      return index.state.user;
    },
  },
  methods: {
    // action post
    submitPost() {
      const objetPost = {
        userId: parseInt(index.state.user.id),
        description: this.bodyPublic,
        title: this.namePublic,
        img: this.imageTemp,
        like: 0,
      };
      post.dispatch("postPost", objetPost);
      this.textSnackbar = this.$tc("Public.snackbar.add");
      this.color = "green";
      this.snackbar = true;
      this.bodyPublic = "";
      this.filePublic = null;
      this.namePublic = "";
    },
    searchImg(img) {
      if (img === null || img === undefined) {
        console.log("image null");
      } else {
        const tipoImagen = img.type;
        if (
          tipoImagen === "image/jpeg" ||
          tipoImagen === "image/png" ||
          tipoImagen === "image/jpg"
        ) {
          this.imageObjet = img;
        } else {
          console.log("archivo no admitido");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(this.imageObjet);
        reader.onload = (e) => {
          if (e.target.result.length < 1000000) {
            this.imageTemp = e.target.result;
          } else {
            this.filePublic = null;
            this.textSnackbar = this.$tc("Public.snackbar.error");
            this.color = "red";
            this.snackbar = true;
          }
        };
      }
    },
    validatePost() {
      if (
        this.filePublic !== null &&
        this.bodyPublic.length >= 5 &&
        this.namePublic.length >= 5
      ) {
        return false;
      } else {
        return true;
      }
    },
    closePublic() {
      post.commit("setOpenPublic", false);
    },
    clickPost(post) {
      this.selectedPost = post;
      this.dialogPost = true;
    },
    closePost() {
      this.dialogPost = false;
    },
    // button like
    iconn(postId) {
      if (this.click[postId]) {
        return "fas far fa-heart";
      } else {
        return "far far fa-heart";
      }
    },
    likedPost(postId) {
      const newValue = !this.click[postId];
      console.log(newValue);
      this.$set(this.click, postId, newValue);
      const value = newValue ? 1 : -1;
      post.dispatch("likedPostState", { postId, value });
    },
    // action coments
    openSheet(postId) {
      this.sheet = true;
      this.postId = postId;
    },
    closeSheet() {
      this.sheet = false;
      this.postId = null;
    },
    deleteComent(coment) {
      post.dispatch("deleteComent", coment);
    },
    sendComentPost(coment, id) {
      let userId = parseInt(index.state.user.id);
      post.dispatch("postComent", { coment, userId, id });
      this.textComent = "";
    },
    lengthComentPost(postId) {
      const comentsFilter = post.state.allComent.filter(
        (coment) => coment.postId === postId
      );
      return comentsFilter.length;
    },
    user(userId) {
      const userFilter = this.getAllUser.find((user) => user.id === userId);
      if (!userFilter) {
        post.dispatch("loadUser");
        return "";
      } else {
        return userFilter;
      }
    },
    createObjet(index, value) {
      this.$set(this.showButtons, index, value);
    },
    deleteObjet(index) {
      this.$delete(this.showButtons, index);
    },
    follow(userPost, user) {
      const value = 1;
      post.dispatch("putUser", { userPost, user, value });
    },
  },
};
</script>
<style>
#card {
  border-radius: 15px;
  background-color: rgba(20, 20, 20, 0.334);
}
</style>