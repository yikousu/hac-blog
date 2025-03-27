import { createRouter, createWebHistory } from "vue-router";
import qqqqq from "@/components/AboutMe.vue";
import SnakeGame from "@/components/SnakeGame.vue";
import SearchComponent from "@/components/SearchComponent.vue";

let routes = [
  {
    path: "/home",
    name: "home",
    // 可以使用箭头函数
    component: () => import("@/components/Home.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: qqqqq,
  },
  {
    path: "/snake",
    name: "snake",
    component: SnakeGame,
  },
  {
    path: "/search",
    name: "search",
    component: SearchComponent,
  },
  {
    path: "/",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
