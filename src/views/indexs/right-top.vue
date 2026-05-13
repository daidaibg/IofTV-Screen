<template>
  <Echart
    v-if="pageflag"
    id="rightTop"
    ref="charts"
    :options="option"
    class="right_top_inner"
  />
  <Reacquire v-else @onclick="getData" style="line-height: 200px">
    重新获取
  </Reacquire>
</template>

<script>
import { currentGET } from "api/modules";
import { graphic } from "echarts";
import {
  bindChartHoverPolling,
  clearTimer,
  startPolling,
} from "@/utils/dashboard";

const createLineSeries = (name, color, data) => ({
  data,
  type: "line",
  smooth: true,
  symbol: "none",
  name,
  color,
  areaStyle: {
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color,
      },
      {
        offset: 1,
        color: color.replace(".7)", ".0)"),
      },
    ]),
  },
  markPoint: {
    data: [
      {
        name: "最大值",
        type: "max",
        valueDim: "y",
        symbol: "rect",
        symbolSize: [60, 26],
        symbolOffset: [0, -20],
        itemStyle: {
          color: "rgba(0,0,0,0)",
        },
        label: {
          color,
          backgroundColor: color.replace(".7)", ".1)"),
          borderRadius: 6,
          padding: [7, 14],
          borderWidth: 0.5,
          borderColor: color.replace(".7)", ".5)"),
          formatter: `${name}：{c}`,
        },
      },
      {
        name: "最大值",
        type: "max",
        valueDim: "y",
        symbol: "circle",
        symbolSize: 6,
        itemStyle: {
          color,
          shadowColor: color,
          shadowBlur: 8,
        },
        label: {
          formatter: "",
        },
      },
    ],
  },
});

export default {
  data() {
    return {
      option: {},
      pageflag: false,
      timer: null,
    };
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    clearTimer(this);
  },
  methods: {
    async getData() {
      this.pageflag = true;

      const res = await currentGET("big4");
      if (!res.success) {
        this.pageflag = false;
        this.$Message({
          text: res.msg,
          type: "warning",
        });
        return;
      }

      this.init(res.data.dateList, res.data.numList, res.data.numList2);
      await this.$nextTick();
      startPolling(this, this.getData);
      bindChartHoverPolling(this, "charts", this.getData);
    },
    init(xData, yData, yData2) {
      this.option = {
        xAxis: {
          type: "category",
          data: xData,
          boundaryGap: false,
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(31,99,163,.2)",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(31,99,163,.1)",
            },
          },
          axisLabel: {
            color: "#7EB7FD",
            fontWeight: "500",
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(31,99,163,.2)",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(31,99,163,.1)",
            },
          },
          axisLabel: {
            color: "#7EB7FD",
            fontWeight: "500",
          },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,.6)",
          borderColor: "rgba(147, 235, 248, .8)",
          textStyle: {
            color: "#FFF",
          },
        },
        grid: {
          show: true,
          left: "10px",
          right: "30px",
          bottom: "10px",
          top: "28px",
          containLabel: true,
          borderColor: "#1F63A3",
        },
        series: [
          createLineSeries("报警1次数", "rgba(252,144,16,.7)", yData),
          createLineSeries("报警2次数", "rgba(9,202,243,.7)", yData2),
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.right_top_inner {
  margin-top: -8px;
}
</style>
