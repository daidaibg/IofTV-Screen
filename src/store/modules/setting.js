import { isObject } from "@/lib/types";

const getSavedSetting = () => JSON.parse(localStorage.getItem("settingData"));

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
    sbtxSwiper: true,
    ssyjSwiper: true,
    isScale: true,
    defaultOption: {
      step: 4.4,
      hoverStop: true,
      openWatch: true,
      direction: 1,
      limitMoveNum: 4,
      singleHeight: 0,
      singleWidth: 0,
      waitTime: 3000,
    },
    echartsAutoTime: 3000,
  }),
  mutations: {
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
    updateSwiper(state, { val, type }) {
      state[type] = val;
      persistSetting(state);
    },
  },
};
