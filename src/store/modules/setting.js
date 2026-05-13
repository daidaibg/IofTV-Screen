import { isObject } from "@/lib/types";

// 读取本地持久化后的大屏设置，页面刷新后仍能恢复用户上次选择。
const getSavedSetting = () => JSON.parse(localStorage.getItem("settingData"));

// 只持久化页面交互会改动的配置项，避免把运行态字段也写进 localStorage。
const persistSetting = (state) => {
  localStorage.setItem(
    "settingData",
    JSON.stringify({
      sbtxSwiper: state.sbtxSwiper,
      ssyjSwiper: state.ssyjSwiper,
      aztpSwiper: state.aztpSwiper,
      isScale: state.isScale,
    })
  );
};

export default {
  state: () => ({
    // 设备提醒列表是否启用无缝滚动。
    sbtxSwiper: true,
    // 实时预警列表是否启用无缝滚动。
    ssyjSwiper: true,
    // 整个大屏是否开启按设计稿比例缩放。
    isScale: true,
    defaultOption: {
      // 无缝滚动速度，值越大滚动越快，所以你之前会看到 4.4 这样的配置值。
      step: 4.4,
      // 鼠标悬停时是否暂停滚动。
      hoverStop: true,
      // 是否监听列表数据变化并自动刷新滚动状态。
      openWatch: true,
      // 滚动方向：0 下，1 上，2 左，3 右。
      direction: 1,
      // 列表数量达到这个值后才开始无缝滚动。
      limitMoveNum: 4,
      // 纵向单步滚动时每次停顿对应的高度。
      singleHeight: 0,
      // 横向单步滚动时每次停顿对应的宽度。
      singleWidth: 0,
      // 初次渲染后等待多久再恢复自动滚动。
      waitTime: 3000,
    },
    // 图表和数字面板的自动轮询间隔，单位毫秒。
    echartsAutoTime: 3000,
  }),
  mutations: {
    // state: setting 模块当前状态对象。
    // 作用：把 localStorage 里的配置同步回 Vuex。
    initSwipers(state) {
      const savedSetting = getSavedSetting();
      if (!savedSetting || !isObject(savedSetting)) {
        return;
      }

      Object.keys(savedSetting).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          state[key] = savedSetting[key];
        }
      });
    },
    // state: setting 模块当前状态对象。
    // val: 需要更新到 state[type] 上的新值。
    // type: 要更新的字段名，例如 sbtxSwiper、ssyjSwiper、isScale。
    updateSwiper(state, { val, type }) {
      state[type] = val;
      persistSetting(state);
    },
  },
};
