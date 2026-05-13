<template>
  <div
    ref="viewport"
    class="auto-scroll"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="auto-scroll__track" :style="trackStyle">
      <div ref="originalGroup" class="auto-scroll__group">
        <div
          v-for="(item, index) in items"
          :key="getItemKey(item, index, 'origin')"
          ref="originalItems"
          class="auto-scroll__item"
        >
          <slot :item="item" :index="index"></slot>
        </div>
      </div>
      <div v-if="shouldScroll" class="auto-scroll__group">
        <div
          v-for="(item, index) in items"
          :key="getItemKey(item, index, 'clone')"
          class="auto-scroll__item"
        >
          <slot :item="item" :index="index"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 项目内自定义滚动组件。
// 目标是替代第三方 seamless-scroll，并通过“按真实锚点滚动”避免长时间运行后的累计偏移。
export default {
  name: "AutoScroll",
  props: {
    // 原始数据列表，组件会按它渲染一份原列表，必要时再补一份克隆列表做无缝循环。
    items: {
      type: Array,
      default: () => [],
    },
    // 外部总开关，关闭后组件保留静态渲染，不启动自动滚动。
    enabled: {
      type: Boolean,
      default: true,
    },
    // item: 一条一条滚动；page: 一整页一整页滚动。
    mode: {
      type: String,
      default: "item",
    },
    // 每次完成停留后多久开始下一次滚动。
    interval: {
      type: Number,
      default: 3000,
    },
    // 单次滚动动画时长。
    duration: {
      type: Number,
      default: 500,
    },
    // 列表数量达到最小值后才启动滚动，避免少量数据也强行循环。
    minCount: {
      type: Number,
      default: 5,
    },
    // 鼠标悬停时是否暂停。
    hoverStop: {
      type: Boolean,
      default: true,
    },
    // 可选业务主键，用来生成更稳定的 vnode key。
    itemKey: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 当前 track 的真实位移值。
      currentOffset: 0,
      // 当前停留在第几个锚点位置。
      currentIndex: 0,
      // 所有可停靠锚点的 offsetTop 集合。
      snapOffsets: [],
      // 原始列表总高度，用于滚到克隆列表后无缝回到开头。
      contentHeight: 0,
      // 视口高度，page 模式需要它计算一页能容纳多少项。
      viewportHeight: 0,
      transitionEnabled: false,
      timer: null,
      resetTimer: null,
      isHovering: false,
    };
  },
  computed: {
    // 只有在开关开启、数据足够、内容确实超出容器时才启用自动滚动。
    shouldScroll() {
      return (
        this.enabled &&
        this.items.length >= this.minCount &&
        this.snapOffsets.length > 1 &&
        this.contentHeight > this.viewportHeight
      );
    },
    // 所有位移动画统一作用在 track 上，避免直接操作单个 item。
    trackStyle() {
      return {
        transform: `translate3d(0, -${this.currentOffset}px, 0)`,
        transition: this.transitionEnabled
          ? `transform ${this.duration}ms ease`
          : "none",
      };
    },
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.reset();
      },
    },
    enabled() {
      this.reset();
    },
    mode() {
      this.reset();
    },
  },
  mounted() {
    this.reset();
    window.addEventListener("resize", this.reset);
  },
  beforeDestroy() {
    this.stop();
    window.removeEventListener("resize", this.reset);
  },
  methods: {
    getItemKey(item, index, suffix) {
      const baseKey =
        this.itemKey && item && item[this.itemKey] !== undefined
          ? item[this.itemKey]
          : index;

      return `${baseKey}-${suffix}`;
    },
    stop() {
      clearTimeout(this.timer);
      clearTimeout(this.resetTimer);
      this.timer = null;
      this.resetTimer = null;
    },
    async reset() {
      this.stop();
      this.transitionEnabled = false;
      this.currentOffset = 0;
      this.currentIndex = 0;
      this.snapOffsets = [];

      await this.$nextTick();
      this.measure();

      if (this.shouldScroll) {
        this.scheduleNext();
      }
    },
    // 每次重算都重新读取真实 DOM，确保切换分辨率、数据变化、样式调整后锚点仍然准确。
    measure() {
      const viewport = this.$refs.viewport;
      const originalGroup = this.$refs.originalGroup;
      const itemNodes = this.$refs.originalItems || [];

      this.viewportHeight = viewport ? viewport.clientHeight : 0;
      this.contentHeight = originalGroup ? originalGroup.scrollHeight : 0;

      if (!itemNodes.length || !this.viewportHeight) {
        this.snapOffsets = [];
        return;
      }

      this.snapOffsets =
        this.mode === "page"
          ? this.createPageOffsets(itemNodes)
          : this.createItemOffsets(itemNodes);
    },
    // 单条模式直接以每个 item 的 offsetTop 作为停靠锚点。
    createItemOffsets(itemNodes) {
      return itemNodes.map((node) => node.offsetTop);
    },
    // 整页模式先算出一页能容纳几项，再按页首 item 的 offsetTop 生成锚点。
    createPageOffsets(itemNodes) {
      const itemOffsets = itemNodes.map((node) => node.offsetTop);
      const itemHeights = itemNodes.map((node) => node.offsetHeight);
      let itemsPerPage = 0;
      let consumedHeight = 0;

      for (let i = 0; i < itemHeights.length; i += 1) {
        if (consumedHeight + itemHeights[i] > this.viewportHeight) {
          break;
        }

        consumedHeight += itemHeights[i];
        itemsPerPage += 1;
      }

      const safeItemsPerPage = Math.max(itemsPerPage, 1);
      const pageOffsets = [];

      for (let i = 0; i < itemOffsets.length; i += safeItemsPerPage) {
        pageOffsets.push(itemOffsets[i]);
      }

      return pageOffsets;
    },
    scheduleNext() {
      if (!this.shouldScroll || (this.hoverStop && this.isHovering)) {
        return;
      }

      this.timer = setTimeout(() => {
        this.moveNext();
      }, this.interval);
    },
    // 每次都跳到预先测量好的真实锚点，而不是做像素累加，避免滚动时间越长误差越大。
    moveNext() {
      if (!this.shouldScroll) {
        return;
      }

      const nextIndex = (this.currentIndex + 1) % this.snapOffsets.length;
      const willLoop = nextIndex === 0;

      this.transitionEnabled = true;
      // 最后一段滚到克隆列表起点，然后立刻无动画复位到 0，看起来就是无缝循环。
      this.currentOffset = willLoop
        ? this.contentHeight
        : this.snapOffsets[nextIndex];

      this.resetTimer = setTimeout(() => {
        if (willLoop) {
          this.transitionEnabled = false;
          this.currentOffset = 0;
        }

        this.currentIndex = nextIndex;
        this.scheduleNext();
      }, this.duration + 20);
    },
    handleMouseEnter() {
      if (!this.hoverStop) {
        return;
      }

      this.isHovering = true;
      this.stop();
    },
    handleMouseLeave() {
      if (!this.hoverStop) {
        return;
      }

      this.isHovering = false;
      this.scheduleNext();
    },
  },
};
</script>

<style lang="scss" scoped>
.auto-scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.auto-scroll__track {
  width: 100%;
  will-change: transform;
}

.auto-scroll__group {
  width: 100%;
}

.auto-scroll__item {
  width: 100%;
  display: flow-root;
  overflow: visible;
}
</style>
