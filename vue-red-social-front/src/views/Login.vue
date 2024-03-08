<template>
  <v-container>
    <v-row class="justify-center smart-colum">
      <v-col class="smart">
        <img class="mr-10" size="50" src="../assets/img/smartphone.png" />
      </v-col>
      <v-col class="d-flex align-center smart-login">
        <v-card
          class="pa-4 ma-0 rounded-xl text-center"
          id="card-smart"
          max-width="400px"
          hover
          dark
        >
          <v-img
            class="mx-auto"
            max-width="300px"
            src="../assets/img/SocialWaveIcon.png"
          />
          <span class="text-subtitle-2 blue--text font-italic"
            >Elegi una de estas opciones</span
          >
          <v-row class="row mx-auto justify-center py-5">
            <v-btn
              class="me-4 d-block"
              rounded
              color="primary"
              hover
              @click="openDialog('login')"
              >Iniciar sesión</v-btn
            >
            <v-btn
              rounded
              color="secondary"
              hover
              @click="openDialog('register')"
              >Registrarse</v-btn
            >
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <!-- modal form generic -->
    <v-dialog
      v-model="openForm"
      persistent
      :maxWidth="maxWidth[1]"
      :key="mode"
      class="mx-auto"
    >
      <Form
        :items="inputsForm"
        :title="title"
        @save="confirmForm"
        @cancel="cancelForm"
        :mode="mode"
        :show="true"
        :errorAlert="errorAlert"
        class="mx-auto"
      >
      </Form>
    </v-dialog>
    <!-- modal avatar -->
    <v-dialog
      v-model="dialogImg"
      persistent
      :maxWidth="maxWidth[1]"
      class="mx-auto"
    >
      <v-card class="rounded-xl" dark>
        <v-container>
          <v-card-text class="subtitle-1 text-center"
            >Selecciona un avatar de perfil
          </v-card-text>
          <v-row class="mx-auto">
            <v-col
              v-for="(image, i) in images"
              :key="i"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-img
                class="mx-auto rounded-pill"
                max-width="200px"
                :src="image.url"
                @click="selectedAvatar(i + 1, image)"
                :class="{ active: selectedImageIndex === i + 1 }"
              />
            </v-col>
          </v-row>
          <v-row class="justify-center">
            <v-btn
              class="ma-4 primary"
              rounded
              @click="registerCheck"
              :disabled="!selectedImageIndex"
              >Empezar</v-btn
            >
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import post from "@/store/post";
import index from "@/store/index";
import Form from "@/components/Form.vue";
export default {
  name: "login",
  components: {
    Form,
  },
  data() {
    return {
      maxWidth: ["200px", "500px"],
      title: "",
      inputsForm: null,
      mode: "",
      typeForm: null,
      users: [],
      errorAlert: { text: "", value: false },
      dialogImg: false,
      images: [
        {
          url: "https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg?t=st=1709037431~exp=1709038031~hmac=63bfda3024e3b6a15db6cb2125c26b1556a7b27126caf84542e6a302c01eda0f",
        },
        {
          url: "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg",
        },
        {
          url: "https://img.freepik.com/free-psd/3d-illustration-person-tank-top_23-2149436202.jpg",
        },
        {
          url: "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg",
        },

        {
          url: "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hat_23-2149436195.jpg",
        },
        {
          url: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436178.jpg",
        },
      ],
      selectedImg: null,
      selectedImageIndex: null,
      isActive: false,
      userTemp: null,
    };
  },
  computed: {
    openForm() {
      return post.state.openForm;
    },
    usersArray() {
      return post.state.allUser;
    },
  },
  async mounted() {
    await post.dispatch("loadUser");
    this.users = this.usersArray;
  },
  methods: {
    async confirmForm(items) {
      switch (this.typeForm) {
        case "login":
          console.log("login");
          this.loginUser(items);
          break;
        case "register":
          console.log("register");

          this.registerUser(items);
          break;
        default:
          break;
      }
    },
    async loginUser(user) {
      const foundUser = this.users.find((element) => {
        return (
          element.name === user.username &&
          parseInt(element.pass) === parseInt(user.password)
        );
      });
      if (foundUser) {
        index.dispatch("userSession", foundUser);
        post.commit("setOpenForm", false);
      } else {
        this.showAlert(this.$tc("Login.alert.errorUser"));
      }
    },
    showAlert(text) {
      this.errorAlert.text = text;
      this.errorAlert.value = true;
      setTimeout(() => {
        this.errorAlert.value = false;
      }, 3000);
    },
    async registerUser(user) {
      const existingUser = this.users.find(
        (element) => element.name === user.username
      );
      if (existingUser) {
        this.showAlert(this.$tc("Login.alert.errorRegister"));
      } else {
        this.dialogImg = true;
        this.userTemp = user;
        post.commit("setOpenForm", false);
      }
    },
    selectedAvatar(index, img) {
      this.selectedImageIndex = index;
      this.selectedImg = img;
      this.isActive = !this.isActive;
    },
    registerCheck() {
      const user = {
        name: this.userTemp.username,
        pass: this.userTemp.password,
        img: this.selectedImg.url,
        follower: 0,
        following: 0,
      };
      index.dispatch("newUser", user);
      this.dialogImg = false;
    },
    async cancelForm() {
      await post.commit("setOpenForm", false);
    },
    async openDialog(type) {
      this.typeForm = type;
      switch (type) {
        case "login":
          this.title = "Inicar sesion";
          this.inputsForm = [
            {
              name: "username",
              label: "Nombre de usuario",
              type: "text",
              rules: [
                (v) => !!v || this.$tc("Login.validation.requerid"),
                (v) =>
                  (v.length >= 3 && v.length <= 10) ||
                  this.$tc("Login.validation.minAndMax"),
              ],
              data: "",
            },
            {
              name: "password",
              label: "Ingrese la contraseña",
              type: "password",
              rules: [
                (v) => !!v || this.$tc("Login.validation.requerid"),
                (v) =>
                  (v.length >= 3 && v.length <= 10) ||
                  this.$tc("Login.validation.minAndMax"),
              ],
              data: "",
            },
          ];
          post.commit("setOpenForm", true);
          break;
        case "register":
          this.title = "Registrarse";
          this.inputsForm = [
            {
              name: "username",
              label: "Nombre de usuario",
              type: "text",
              rules: [
                (v) => !!v || this.$tc("Login.validation.requerid"),
                (v) =>
                  (v.length >= 3 && v.length <= 10) ||
                  this.$tc("Login.validation.minAndMax"),
              ],
              data: "",
            },
            {
              name: "password",
              label: "Ingrese la contraseña",
              type: "password",
              rules: [
                (v) => !!v || this.$tc("Login.validation.requerid"),
                (v) =>
                  (v.length >= 3 && v.length <= 10) ||
                  this.$tc("Login.validation.minAndMax"),
              ],
              data: "",
            },
          ];
          post.commit("setOpenForm", true);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style>
.smart-colum {
  columns: 6;
}
.smart {
  display: flex;
  justify-content: end;
}
.active {
  border: 5px solid #9587ff;
}
.smart-login {
  justify-content: start;
}

#card-smart {
  left: 4em;
}

@media screen and (max-width: 600px) {
  .smart {
    display: none;
  }
  .smart-colum {
    columns: 12;
  }
  .smart-login {
    justify-content: center;
  }
  #card-smart {
    left: 15px;
  }
}
</style>