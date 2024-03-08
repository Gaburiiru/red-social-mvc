import Vue from "vue";
import VueRouter from "vue-router";
import index from "@/store/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/Search.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profileUser",
    name: "profileUser",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileUser.vue"),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Verificar si la ruta es reconocida y requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Esperar a que se cargue el usuario
    await index.dispatch("initializeSession");

    if (index.state.user === "") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    next();
  }

  // Verificar si la ruta no es reconocida
  if (!to.matched.length) {
    next({ name: "/login" });
  }
});

export default router;
