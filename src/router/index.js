import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/index",
        name: "index",
        component: () => import("../views/indexs/index.vue"),
      },
    ],
  },
];

export default new VueRouter({
  mode: "hash",
  routes,
});
