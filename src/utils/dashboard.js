// 清理组件上的轮询定时器，避免重复开启或组件销毁后继续请求。
export const clearTimer = (vm, timerKey = "timer") => {
  if (!vm[timerKey]) {
    return;
  }

  clearInterval(vm[timerKey]);
  vm[timerKey] = null;
};

// 大屏图表的自动刷新统一走这里，刷新间隔直接读取全局设置。
export const startPolling = (vm, callback, timerKey = "timer") => {
  if (vm[timerKey]) {
    return;
  }

  vm[timerKey] = setInterval(callback, vm.$store.state.setting.echartsAutoTime);
};

// 图表悬停时暂停轮询，移出后恢复，避免用户查看数据时被自动刷新打断。
export const bindChartHoverPolling = (
  vm,
  refName,
  callback,
  timerKey = "timer"
) => {
  const chartRef = vm.$refs[refName];
  const chart = chartRef && chartRef.chart;

  if (!chart || chart.__pollingBound) {
    return;
  }

  chart.on("mouseover", () => clearTimer(vm, timerKey));
  chart.on("mouseout", () => startPolling(vm, callback, timerKey));
  chart.__pollingBound = true;
};

// 列表组件销毁时顺手把滚动恢复计时器也清掉。
export const clearScrollStepTimer = (vm) => {
  clearTimeout(vm._scrollStepTimer);
  vm._scrollStepTimer = null;
};

// 把省/市/区县字段安全拼成展示文案，避免页面里反复手写拼接逻辑。
export const joinRegionName = (
  item,
  keys = ["provinceName", "cityName", "countyName"]
) => keys.map((key) => item[key]).filter(Boolean).join("/");
