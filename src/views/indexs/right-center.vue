<template>
  <div
    v-if="pageflag"
    class="right_center_wrap beautify-scroll-def"
    :class="{ 'overflow-y-auto': !scrollEnabled }"
  >
    <component :is="scrollComponent" :data="list" :class-option="defaultOption">
      <ul class="right_center">
        <li v-for="(item, i) in list" :key="i" class="right_center_item">
          <span class="orderNum">{{ i + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels">设备ID：</span>
                <span class="contents zhuyao">{{ item.gatewayno }}</span>
              </div>
              <div class="info">
                <span class="labels">型号：</span>
                <span class="contents">{{ item.terminalno }}</span>
              </div>
              <div class="info">
                <span class="labels">告警值：</span>
                <span class="contents warning">
                  {{ item.alertvalue | montionFilter }}
                </span>
              </div>
            </div>

            <div class="flex">
              <div class="info">
                <span class="labels">地址：</span>
                <span class="contents ciyao" style="font-size: 12px">
                  {{ addressText(item) }}
                </span>
              </div>
              <div class="info time">
                <span class="labels">时间：</span>
                <span class="contents" style="font-size: 12px">
                  {{ item.createtime }}
                </span>
              </div>
            </div>
            <div class="flex">
              <div class="info">
                <span class="labels">报警内容：</span>
                <span class="contents ciyao" :class="{ warning: item.alertdetail }">
                  {{ item.alertdetail || "无" }}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </component>
  </div>
  <Reacquire v-else @onclick="getData" style="line-height: 200px" />
</template>

<script>
import { currentGET } from "api/modules";
import vueSeamlessScroll from "vue-seamless-scroll";
import Kong from "../../components/kong.vue";
import {
  clearScrollStepTimer,
  joinRegionName,
  syncScrollStep,
} from "@/utils/dashboard";

export default {
  components: { vueSeamlessScroll, Kong },
  data() {
    return {
      list: [],
      pageflag: true,
      defaultOption: {
        ...this.$store.state.setting.defaultOption,
        limitMoveNum: 3,
        singleHeight: 250,
        step: 0,
      },
    };
  },
  computed: {
    scrollEnabled() {
      return this.$store.state.setting.ssyjSwiper;
    },
    scrollComponent() {
      return this.scrollEnabled ? vueSeamlessScroll : Kong;
    },
  },
  created() {
    this.getData();
  },
  beforeDestroy() {
    clearScrollStepTimer(this);
  },
  methods: {
    addressText(item) {
      return joinRegionName(item);
    },
    async getData() {
      this.pageflag = true;

      const res = await currentGET("big5", { limitNum: 50 });
      if (!res.success) {
        this.pageflag = false;
        this.$Message.warning(res.msg);
        return;
      }

      this.list = res.data.list;
      syncScrollStep(this);
    },
  },
};
</script>

<style lang="scss" scoped>
.right_center {
  width: 100%;
  height: 100%;

  .right_center_item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: auto;
    padding: 10px;
    font-size: 14px;
    color: #fff;

    .orderNum {
      margin: 0 20px 0 -20px;
    }

    .inner_right {
      position: relative;
      height: 100%;
      width: 400px;
      flex-shrink: 0;
      line-height: 1.5;

      .dibu {
        position: absolute;
        height: 2px;
        width: 104%;
        background-image: url("../../assets/img/zuo_xuxian.png");
        bottom: -12px;
        left: -2%;
        background-size: cover;
      }
    }

    .info {
      margin-right: 10px;
      display: flex;
      align-items: center;

      .labels {
        flex-shrink: 0;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .zhuyao {
        color: $primary-color;
        font-size: 15px;
      }

      .ciyao {
        color: rgba(255, 255, 255, 0.8);
      }

      .warning {
        color: #e6a23c;
        font-size: 15px;
      }
    }
  }
}

.right_center_wrap {
  overflow: hidden;
  width: 100%;
  height: 250px;
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
