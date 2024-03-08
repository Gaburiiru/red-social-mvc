<template>
  <v-row>
    <v-col class="text-center mt-5">
      <v-container>
        <v-col class="justify-center ma-0">
          <v-img width="130" class="rounded-pill mx-auto" :src="userData.img" />
          <h2 class="white--text ma-2 text-capitalize">{{ userData.name }}</h2>
          <v-row class="white--text align-center justify-center ma-0 pa-0">
            <p class="my-auto mr-2">{{ userData.follower }}</p>
            <h4 class="font-weight-light">
              {{ this.$tc("Profile.follower") }}
            </h4>
            <p class="my-auto mx-2">{{ userData.following }}</p>
            <h4 class="font-weight-light">
              {{ this.$tc("Profile.following") }}
            </h4>
          </v-row>
          <v-btn
            v-show="
              parseInt(userSession.id) !== parseInt(userData.id) &&
              userData.id !== 'undefined'
            "
            class="mt-4"
            rounded
            :color="!newValue ? 'primary' : 'grey'"
            @click="follow"
          >
            <p class="my-auto" v-if="!newValue">
              {{ this.$tc("Profile.follow") }}
            </p>
            <p v-else class="my-auto">{{ this.$tc("Profile.notFollow") }}</p>
            <v-icon v-if="!newValue" class="ml-2" size="20"
              >fas fa-user-plus</v-icon
            >
            <v-icon v-else class="ml-2" size="20">fas fa-user-times</v-icon>
          </v-btn>
        </v-col>
      </v-container>

      <v-row class="justify-center ma-4">
        <v-icon color="white">fas fa-camera-retro</v-icon>
        <h4 class="white--text ml-4">{{ this.$tc("Profile.title") }}</h4>
      </v-row>
      <v-card
        class="mx-auto rounded-xl pa-0 ma-0"
        dark
        :max-width="isSmallScreen ? 'min-content' : '950'"
      >
        <v-row class="pa-0 ma-0">
          <v-col
            v-for="(data, i) in arrayPost"
            :key="i"
            class="ma-0 pa-2"
            cols="12"
            xl="4"
            md="4"
            sm="6"
          >
            <v-img
              id="img"
              :src="data.img"
              class="mx-auto ma-0 pa-0 rounded-xl"
              @mouseenter="createObjet(i, true)"
              @mouseleave="deleteObjet(i, false)"
              width="300"
              height="300"
            >
              <v-row
                v-if="
                  showButtons[i] && parseInt(userSession.id) === data.userId
                "
                id="icon"
              >
                <v-btn fab class="mr-4" color="primary" @click="editPost(data)">
                  <v-icon>fas fa-edit</v-icon>
                </v-btn>
                <v-btn fab class="ml-4" color="error" @click="deletePost(data)">
                  <v-icon>fas fa-trash-alt</v-icon>
                </v-btn>
              </v-row>
            </v-img>
          </v-col>
        </v-row>
      </v-card>
      <!-- modal Edit -->
      <v-dialog
        v-model="dialogEdit"
        v-if="(dialogEdit, selectedPost)"
        max-width="500"
        persistent
      >
        <v-card class="text-center rounded-xl" dark>
          <v-container>
            <v-icon class="pt-1" color="red" @click="dialogEdit = false">
              fas fa-times-circle
            </v-icon>
            <h3 class="my-2">{{ this.$tc("Profile.titleEdit") }}</h3>
            <v-divider />
            <v-text-field
              :label="this.$tc('Public.inputName')"
              v-model="selectedPost.title"
              :rules="[rules.required, rules.min]"
              outlined
              counter
              class="ma-2 mt-4"
              rounded
              dense
            />
            <v-textarea
              v-model="selectedPost.description"
              :label="this.$tc('Public.inputArea')"
              :rules="[rulesArea.required, rulesArea.min]"
              outlined
              dense
              rounded
              counter
              class="ma-2"
            />
            <input
              type="file"
              ref="boton"
              class="d-none"
              @change="searchImg($event)"
              accept="image/*"
            />
            <v-img
              @click="$refs.boton.click()"
              @mouseenter="showIcon = true"
              @mouseleave="showIcon = false"
              id="img"
              class="mx-auto rounded-pill mb-2"
              width="150"
              height="150"
              :src="imageTemp"
            >
              <v-icon id="icon" v-show="showIcon">far fa-image</v-icon>
            </v-img>
            <v-row class="justify-center pa-4">
              <v-btn
                color="primary"
                rounded
                :disabled="validatePost(selectedPost)"
                @click="submitEditPost(selectedPost, imageTemp)"
              >
                {{ this.$tc("Profile.buttons.edit") }}
                <v-icon class="ml-2" size="15">fas fa-recycle</v-icon>
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <!-- modal Delete -->
      <v-dialog
        v-model="dialogDelete"
        v-if="(dialogDelete, selectedPost)"
        max-width="500"
        persistent
      >
        <v-card class="text-center rounded-xl" dark>
          <v-container>
            <v-icon class="pt-1" color="red" @click="dialogDelete = false">
              fas fa-times-circle
            </v-icon>
            <h3 class="my-2">{{ this.$tc("Profile.titleDelete") }}</h3>
            <v-divider />
            <h4
              class="ma-2 text-capitalize font-weight-regular font-italic grey--text"
            >
              {{ selectedPost.title }}
            </h4>
            <v-img
              :src="selectedPost.img"
              width="150"
              height="150"
              class="mx-auto rounded-pill my-4"
              style="filter: saturate(0)"
            />
            <v-row class="justify-center pa-4">
              <v-btn
                color="primary"
                rounded
                @click="submitDeletePost(selectedPost)"
              >
                {{ this.$tc("Profile.buttons.delete") }}
                <v-icon class="ml-2" size="15">fas fa-dumpster-fire</v-icon>
              </v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <!-- alerta -->
      <v-snackbar :color="color" v-model="snackbar">
        {{ textSnackbar }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            fab
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            <v-icon>fas fa-times-circle</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>
  
  <script>
import index from "@/store/index";
import post from "@/store/post";
export default {
  async mounted() {
    await post.dispatch("loadPost");
    this.isSmallScreen = window.innerWidth < 600;
  },
  name: "UserProfile",
  data() {
    return {
      arrayPost: [],
      showButtons: [],
      isSmallScreen: false,
      dialogEdit: false,
      selectedPost: null,
      dialogDelete: false,
      rules: {
        required: (value) => !!value || this.$tc("Public.validation.requerid"),
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
      showIcon: false,
      snackbar: false,
      textSnackbar: "",
      color: null,
      newValue: false,
    };
  },
  watch: {
    async postObserver(newPosts) {
      this.arrayPost = newPosts.filter(
        (post) => post.userId === parseInt(this.userData.id)
      );
    },
  },
  computed: {
    postObserver() {
      return post.state.allPost;
    },
    userSession() {
      return index.state.user;
    },
    userOther() {
      return index.state.userSearch;
    },
  },
  methods: {
    // show buttons
    createObjet(index, value) {
      this.$set(this.showButtons, index, value);
    },
    deleteObjet(index) {
      this.$delete(this.showButtons, index);
    },
    // actions buttons
    editPost(post) {
      this.dialogEdit = true;
      this.selectedPost = post;
      this.imageTemp = post.img;
    },
    // convert images
    searchImg(event) {
      const tipoImagen = event.target.files[0].type;
      if (
        tipoImagen === "image/jpeg" ||
        tipoImagen === "image/png" ||
        tipoImagen === "image/jpg"
      ) {
        this.imageObjet = event.target.files[0];
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
          this.textSnackbar = this.$tc("Public.snackbar.error");
          this.color = "red";
          this.snackbar = true;
        }
      };
    },
    // validateEdit
    validatePost(post) {
      if (
        post.img !== null &&
        post.title.length >= 5 &&
        post.description.length >= 5
      ) {
        return false;
      } else {
        return true;
      }
    },
    // edit store
    async submitEditPost(postUpdate, image) {
      this.dialogEdit = false;
      const objet = {
        description: postUpdate.description,
        id: postUpdate.id,
        img: image,
        like: postUpdate.like,
        title: postUpdate.title,
        userId: postUpdate.userId,
      };
      await post.dispatch("putPost", objet);
      this.textSnackbar = this.$tc("Profile.snackbar.edit");
      this.color = "green";
      this.snackbar = true;
    },
    // actions buttons
    deletePost(post) {
      this.dialogDelete = true;
      this.selectedPost = post;
    },
    // delete store
    submitDeletePost(postDelete) {
      post.dispatch("deletePost", postDelete);
      this.dialogDelete = false;
      this.textSnackbar = this.$tc("Profile.snackbar.delete");
      this.color = "green";
      this.snackbar = true;
    },
    follow() {
      this.newValue = !this.newValue;
      const value = this.newValue ? 1 : -1;
      const userOther = this.userOther;
      const user = this.userSession;
      this.userData.follower = this.userData.follower + value;
      post.dispatch("putUserProfile", { userOther, user, value });
    },
  },
  props: {
    userData: {
      type: Object,
    },
  },
};
</script>
  
<style>
#img:hover {
  position: relative;
}

#img:hover::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.736);
}

#icon {
  color: #ffffffd2;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>