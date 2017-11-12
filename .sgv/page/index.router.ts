import Vue from "vue";
import VueRouter, { RouteConfig } from "../lib/vue-router";
import * as PageFactory from "./pages/factory.page";

Vue.use(VueRouter);
const routes: RouteConfig[] = [
  // SGV-BUILD-PAGE-ROUTER-CONFIG # NOT DELETE
];
const router = new VueRouter({
  routes,
});

export default router;
