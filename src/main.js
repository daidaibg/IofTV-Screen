import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  loading,
  borderBox13,
  digitalFlop,
  capsuleChart,
  borderBox8,
} from "@jiaminghi/data-view";
import { Radio, Button, RadioGroup } from "element-ui";
import Echart from "./components/echart/index.vue";
import ItemWrap from "./components/item-wrap/item-wrap.vue";
import Message from "./components/message/message.vue";
import Reacquire from "./components/reacquire/reacquire.vue";
import Messages from "./components/message/message";
import "vue-easytable/libs/theme-default/index.css";
import "@/assets/css/public.scss";
import "@/assets/css/index.scss";
import * as filters from "@/directives/filters";

require("./mock/mock");

Vue.config.productionTip = false;

[
  ["Echart", Echart],
  ["ItemWrap", ItemWrap],
  ["Message", Message],
  ["Reacquire", Reacquire],
].forEach(([name, component]) => Vue.component(name, component));

[Radio, Button, RadioGroup].forEach((component) => Vue.use(component));
[loading, borderBox13, borderBox8, digitalFlop, capsuleChart].forEach(
  (component) => Vue.use(component)
);

Object.entries(filters).forEach(([name, filter]) => Vue.filter(name, filter));

Vue.prototype.$Message = Messages;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
