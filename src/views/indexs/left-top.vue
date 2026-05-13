<template>
  <ul v-if="pageflag" class="user_Overview flex">
    <li class="user_Overview-item" style="color: #00fdfa">
      <div class="user_Overview_nums allnum">
        <dv-digital-flop :config="config" style="width: 100%; height: 100%" />
      </div>
      <p>总设备数</p>
    </li>
    <li class="user_Overview-item" style="color: #07f7a8">
      <div class="user_Overview_nums online">
        <dv-digital-flop
          :config="onlineconfig"
          style="width: 100%; height: 100%"
        />
      </div>
      <p>在线数</p>
    </li>
    <li class="user_Overview-item" style="color: #e3b337">
      <div class="user_Overview_nums offline">
        <dv-digital-flop
          :config="offlineconfig"
          style="width: 100%; height: 100%"
        />
      </div>
      <p>离线数</p>
    </li>
    <li class="user_Overview-item" style="color: #f5023d">
      <div class="user_Overview_nums laramnum">
        <dv-digital-flop
          :config="laramnumconfig"
          style="width: 100%; height: 100%"
        />
      </div>
      <p>告警次数</p>
    </li>
  </ul>
  <Reacquire v-else @onclick="getData" line-height="200px">
    重新获取
  </Reacquire>
</template>

<script>
import { currentGET } from "api/modules";
import { clearTimer, startPolling } from "@/utils/dashboard";

const baseStyle = {
  fontSize: 24,
};

const createFlopConfig = (fill, number = 0) => ({
  number: [number],
  content: "{nt}",
  style: {
    ...baseStyle,
    fill,
  },
});

export default {
  data() {
    return {
      pageflag: true,
      timer: null,
      config: createFlopConfig("#00fdfa", 100),
      onlineconfig: createFlopConfig("#07f7a8"),
      offlineconfig: createFlopConfig("#e3b337"),
      laramnumconfig: createFlopConfig("#f5023d"),
    };
  },
  created() {
    this.getData();
  },
  beforeDestroy() {
    clearTimer(this);
  },
  methods: {
    async getData() {
      this.pageflag = true;

      const res = await currentGET("big2");
      if (!res.success) {
        this.pageflag = false;
        this.$Message.warning(res.msg);
        return;
      }

      const { totalNum, onlineNum, offlineNum, alarmNum } = res.data;
      this.config = createFlopConfig("#00fdfa", totalNum);
      this.onlineconfig = createFlopConfig("#07f7a8", onlineNum);
      this.offlineconfig = createFlopConfig("#e3b337", offlineNum);
      this.laramnumconfig = createFlopConfig("#f5023d", alarmNum);

      startPolling(this, this.getData);
    },
  },
};
</script>

<style lang="scss" scoped>
.user_Overview {
  li {
    flex: 1;

    p {
      text-align: center;
      height: 16px;
      font-size: 16px;
    }

    .user_Overview_nums {
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      font-size: 22px;
      margin: 50px auto 30px;
      background-size: cover;
      background-position: center center;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      &.bgdonghua::before {
        animation: rotating 14s linear infinite;
      }
    }

    .allnum::before {
      background-image: url("../../assets/img/left_top_lan.png");
    }

    .online::before {
      background-image: url("../../assets/img/left_top_lv.png");
    }

    .offline::before {
      background-image: url("../../assets/img/left_top_huang.png");
    }

    .laramnum::before {
      background-image: url("../../assets/img/left_top_hong.png");
    }
  }
}
</style>
