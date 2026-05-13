<template>
  <div class="right_bottom">
    <dv-capsule-chart :config="config" style="width: 100%; height: 260px" />
  </div>
</template>

<script>
import { currentGET } from "api/modules";
import { clearTimer, startPolling } from "@/utils/dashboard";

export default {
  data() {
    return {
      gatewayno: "",
      timer: null,
      config: {
        showValue: true,
        unit: "次",
        data: [],
      },
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
      const res = await currentGET("big7", { gatewayno: this.gatewayno });
      if (!res.success) {
        this.$Message({
          text: res.msg,
          type: "warning",
        });
        return;
      }

      this.config = {
        ...this.config,
        data: res.data,
      };

      startPolling(this, this.getData);
    },
  },
};
</script>

<style lang="scss" scoped>
.right_bottom {
  box-sizing: border-box;
  padding: 0 16px;
}
</style>
