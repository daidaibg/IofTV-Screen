<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ maptitle }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <dv-border-box-13>
        <div v-if="code !== 'china'" class="quanguo" @click="getData('china')">
          中国
        </div>

        <Echart id="CenterMap" ref="CenterMap" :options="options" />
      </dv-border-box-13>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import xzqCode from "../../utils/map/xzqCode";
import { GETNOBASE } from "api";
import { currentGET } from "api/modules";

const mapLevels = [
  { gte: 1000, label: "1000个以上" },
  { gte: 600, lte: 999, label: "600-999个" },
  { gte: 200, lte: 599, label: "200-599个" },
  { gte: 50, lte: 199, label: "50-199个" },
  { gte: 10, lte: 49, label: "10-49个" },
  { lte: 9, label: "1-9个" },
];

export default {
  data() {
    return {
      maptitle: "设备分布图",
      options: {},
      code: "china",
      echartBindClick: false,
      isSouthChinaSea: false,
    };
  },
  mounted() {
    this.getData("china");
  },
  methods: {
    async getData(code) {
      const res = await currentGET("big8", { regionCode: code });
      if (!res.success) {
        this.$Message.warning(res.msg);
        return;
      }

      await this.getGeojson(res.data.regionCode, res.data.dataList);
      this.bindMapClick();
    },
    async getGeojson(name, sourceData) {
      this.code = name;
      const mapName =
        this.isSouthChinaSea && name === "china" ? "chinaNanhai" : name;
      const geoJson = await this.loadMapJson(name, mapName);
      const cityCenter = geoJson.features.reduce((accumulator, item) => {
        accumulator[item.properties.name] =
          item.properties.centroid || item.properties.center;
        return accumulator;
      }, {});

      const pointData = sourceData.reduce((result, item) => {
        const center = cityCenter[item.name];
        if (center) {
          result.push({
            name: item.name,
            value: center.concat(item.value),
          });
        }
        return result;
      }, []);

      this.init(name, sourceData, pointData);
    },
    async loadMapJson(name, mapName) {
      const cacheMap = echarts.getMap(name);
      if (cacheMap) {
        return cacheMap.geoJSON;
      }

      const geoJson = await GETNOBASE(`./map-geojson/${mapName}.json`);
      echarts.registerMap(name, geoJson);
      return geoJson;
    },
    init(name, data, pointData) {
      const top = 45;
      const zoom = 1.05;

      this.options = {
        backgroundColor: "rgba(0,0,0,0)",
        tooltip: {
          show: false,
        },
        legend: {
          show: false,
        },
        visualMap: {
          left: 20,
          bottom: 20,
          pieces: mapLevels,
          inRange: {
            color: [
              "#c3d7df",
              "#5cb3cc",
              "#8abcd1",
              "#66a9c9",
              "#2f90b9",
              "#1781b5",
            ],
          },
          textStyle: {
            color: "#fff",
          },
        },
        geo: {
          map: name,
          roam: false,
          selectedMode: false,
          zoom,
          top,
          show: false,
        },
        series: [
          {
            name: "MAP",
            type: "map",
            map: name,
            data,
            selectedMode: false,
            zoom,
            geoIndex: 1,
            top,
            tooltip: {
              show: true,
              formatter(params) {
                return params.data
                  ? `${params.name}：${params.data.value}`
                  : params.name;
              },
              backgroundColor: "rgba(0,0,0,.6)",
              borderColor: "rgba(147, 235, 248, .8)",
              textStyle: {
                color: "#FFF",
              },
            },
            label: {
              show: false,
              color: "#000",
              formatter(val) {
                return val.data ? val.name.slice(0, 2) : "";
              },
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                areaColor: "#389BB7",
                borderWidth: 1,
              },
            },
            itemStyle: {
              borderColor: "rgba(147, 235, 248, .8)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)",
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)",
                  },
                ],
                globalCoord: false,
              },
              shadowColor: "rgba(128, 217, 248, .3)",
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10,
            },
          },
          {
            data: pointData,
            type: "effectScatter",
            coordinateSystem: "geo",
            symbolSize() {
              return 4;
            },
            legendHoverLink: true,
            showEffectOn: "render",
            rippleEffect: {
              scale: 6,
              color: "rgba(255,255,255, 1)",
              brushType: "fill",
            },
            tooltip: {
              show: true,
              formatter(params) {
                return params.data
                  ? `${params.name}：${params.data.value[2]}`
                  : params.name;
              },
              backgroundColor: "rgba(0,0,0,.6)",
              borderColor: "rgba(147, 235, 248, .8)",
              textStyle: {
                color: "#FFF",
              },
            },
            label: {
              formatter(param) {
                return param.name.slice(0, 2);
              },
              fontSize: 11,
              offset: [0, 2],
              position: "bottom",
              textBorderColor: "#fff",
              textShadowColor: "#000",
              textShadowBlur: 10,
              textBorderWidth: 0,
              color: "#FFF",
              show: true,
            },
            itemStyle: {
              color: "rgba(255,255,255,1)",
              borderColor: "rgba(255,255,255,2)",
              borderWidth: 4,
              shadowColor: "#000",
              shadowBlur: 10,
            },
          },
        ],
      };
    },
    bindMapClick() {
      if (this.echartBindClick) {
        return;
      }

      this.$refs.CenterMap.chart.on("click", (params) => {
        const xzqData = xzqCode[params.name];
        if (!xzqData) {
          this.$Message.warning("暂无下级地市");
          return;
        }

        this.getData(xzqData.adcode);
      });
      this.echartBindClick = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(
        92deg,
        #0072ff 0%,
        #00eaff 48.8525390625%,
        #01aaff 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("../../assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("../../assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 548px;
    width: 100%;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5),
        0 0 6px rgba(0, 237, 237, 0.4);
    }
  }
}
</style>
