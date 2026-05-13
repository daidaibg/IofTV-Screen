<template>
  <div :id="id" :class="className" :style="{ height, width }" />
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "echart",
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    options: {
      handler(options) {
        if (this.chart) {
          this.chart.setOption(options, true);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = echarts.init(this.$el);
    this.chart.setOption(this.options, true);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
};
</script>
