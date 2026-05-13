import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// 自动收集 modules 目录下的模块，避免每新增一个 store 模块都手动 import。
const modulesFiles = require.context("./modules", true, /\.js$/);
const modules = modulesFiles.keys().reduce((result, modulePath) => {
  // ./setting.js -> setting，作为最终的模块名使用。
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const module = modulesFiles(modulePath).default;

  result[moduleName] = {
    ...module,
    // 所有模块默认开启命名空间，组件里通过 setting/updateSwiper 这类方式调用。
    namespaced: true,
  };
  return result;
}, {});

export default new Vuex.Store({
  // 当前项目的全局状态全部从模块挂载，根 store 不再额外维护重复状态。
  modules,
});
