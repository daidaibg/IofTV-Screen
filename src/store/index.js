import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((result, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const module = modulesFiles(modulePath).default;

  result[moduleName] = {
    ...module,
    namespaced: true,
  };
  return result;
}, {});

export default new Vuex.Store({
  modules,
});
