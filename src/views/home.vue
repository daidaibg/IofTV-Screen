<template>
  <ScaleScreen
    :width="1920"
    :height="1080"
    class="scale-wrap"
    :selfAdaption="$store.state.setting.isScale"
  >
    <div class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="d-flex jc-center title_wrap">
          <div class="zuojuxing"></div>
          <div class="youjuxing"></div>
          <div class="guang"></div>
          <div class="d-flex jc-center">
            <div class="title">
              <span class="title-text">互联网设备可视化平台</span>
            </div>
          </div>
          <div class="timers">
            {{ dateYear }} {{ dateWeek }} {{ dateDay }}
            <i
              class="blq-icon-shezhi02"
              style="margin-left: 10px"
              @click="showSetting"
            ></i>
          </div>
        </div>
        <router-view />
      </div>
    </div>
    <Setting ref="setting" />
  </ScaleScreen>
</template>

<script>
import { formatTime } from "../utils";
import Setting from "./setting.vue";
import ScaleScreen from "@/components/scale-screen/scale-screen.vue";

const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default {
  components: { Setting, ScaleScreen },
  data() {
    return {
      timing: null,
      loading: true,
      dateDay: "",
      dateYear: "",
      dateWeek: "",
    };
  },
  mounted() {
    this.updateClock();
    this.timing = setInterval(this.updateClock, 1000);
    setTimeout(() => {
      this.loading = false;
    }, 500);
  },
  beforeDestroy() {
    clearInterval(this.timing);
  },
  methods: {
    showSetting() {
      this.$refs.setting.init();
    },
    updateClock() {
      const now = new Date();
      this.dateDay = formatTime(now, "HH: mm: ss");
      this.dateYear = formatTime(now, "yyyy-MM-dd");
      this.dateWeek = weekday[now.getDay()];
    },
  },
};
</script>

<style lang="scss">
@import "./home.scss";
</style>
