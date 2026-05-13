<template>
  <div
    v-if="pageflag"
    class="left_boottom_wrap beautify-scroll-def"
    :class="{ 'overflow-y-auto': !scrollEnabled }"
  >
    <AutoScroll
      v-if="scrollEnabled"
      :items="list"
      :enabled="scrollEnabled"
      mode="page"
      :interval="$store.state.setting.defaultOption.waitTime"
      :duration="500"
      :min-count="5"
      item-key="gatewayno"
    >
      <template #default="{ item, index }">
        <div class="left_boottom_item">
          <span class="orderNum doudong">{{ index + 1 }}</span>
          <div class="inner_right">
            <div class="dibu"></div>
            <div class="flex">
              <div class="info">
                <span class="labels">设备ID：</span>
                <span class="contents zhuyao doudong wangguan">
                  {{ item.gatewayno }}
                </span>
              </div>
              <div class="info">
                <span class="labels">时间：</span>
                <span class="contents" style="font-size: 12px">
                  {{ item.createTime }}
                </span>
              </div>
            </div>

            <span
              class="types doudong"
              :class="{
                typeRed: item.onlineState == 0,
                typeGreen: item.onlineState == 1,
              }"
            >
              {{ item.onlineState == 1 ? "在线" : "离线" }}
            </span>

            <div class="info addresswrap">
              <span class="labels">地址：</span>
              <span class="contents ciyao" style="font-size: 12px">
                {{ addressHandle(item) }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </AutoScroll>

    <div v-else class="left_boottom">
      <div v-for="(item, i) in list" :key="i" class="left_boottom_item">
        <span class="orderNum doudong">{{ i + 1 }}</span>
        <div class="inner_right">
          <div class="dibu"></div>
          <div class="flex">
            <div class="info">
              <span class="labels">设备ID：</span>
              <span class="contents zhuyao doudong wangguan">
                {{ item.gatewayno }}
              </span>
            </div>
            <div class="info">
              <span class="labels">时间：</span>
              <span class="contents" style="font-size: 12px">
                {{ item.createTime }}
              </span>
            </div>
          </div>

          <span
            class="types doudong"
            :class="{
              typeRed: item.onlineState == 0,
              typeGreen: item.onlineState == 1,
            }"
          >
            {{ item.onlineState == 1 ? "在线" : "离线" }}
          </span>

          <div class="info addresswrap">
            <span class="labels">地址：</span>
            <span class="contents ciyao" style="font-size: 12px">
              {{ addressHandle(item) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Reacquire v-else @onclick="getData" style="line-height: 200px" />
</template>

<script>
import { currentGET } from "api";
import AutoScroll from "@/components/auto-scroll/auto-scroll.vue";
import { joinRegionName } from "@/utils/dashboard";

export default {
  components: { AutoScroll },
  data() {
    return {
      list: [],
      pageflag: true,
    };
  },
  computed: {
    scrollEnabled() {
      return this.$store.state.setting.sbtxSwiper;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    addressHandle(item) {
      return joinRegionName(item);
    },
    async getData() {
      this.pageflag = true;

      const res = await currentGET("big3", { limitNum: 20 });
      if (!res.success) {
        this.pageflag = false;
        this.$Message({
          text: res.msg,
          type: "warning",
        });
        return;
      }

      this.list = res.data.list;
    },
  },
};
</script>

<style lang="scss" scoped>
.left_boottom_wrap {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.doudong {
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
}

.overflow-y-auto {
  overflow-y: auto;
}

.left_boottom {
  width: 100%;
  height: 100%;
}

.left_boottom_item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 14px;
  margin: 10px 0;

  .orderNum {
    margin: 0 16px 0 -20px;
  }

  .info {
    margin-right: 10px;
    display: flex;
    align-items: center;
    color: #fff;

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
  }

  .inner_right {
    position: relative;
    height: 100%;
    width: 380px;
    flex-shrink: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;

    .dibu {
      position: absolute;
      height: 2px;
      width: 104%;
      background-image: url("../../assets/img/zuo_xuxian.png");
      bottom: -10px;
      left: -2%;
      background-size: cover;
    }

    .addresswrap {
      width: 100%;
      display: flex;
      margin-top: 8px;
    }
  }

  .wangguan {
    color: #1890ff;
    font-weight: 900;
    font-size: 15px;
    width: 80px;
    flex-shrink: 0;
  }

  .types {
    width: 30px;
    flex-shrink: 0;
  }

  .typeRed {
    color: #fc1a1a;
  }

  .typeGreen {
    color: #29fc29;
  }
}
</style>
