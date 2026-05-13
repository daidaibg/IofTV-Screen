export const clearTimer = (vm, timerKey = "timer") => {
  if (!vm[timerKey]) {
    return;
  }

  clearInterval(vm[timerKey]);
  vm[timerKey] = null;
};

export const startPolling = (vm, callback, timerKey = "timer") => {
  if (vm[timerKey]) {
    return;
  }

  vm[timerKey] = setInterval(callback, vm.$store.state.setting.echartsAutoTime);
};

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

export const syncScrollStep = (vm, optionKey = "defaultOption") => {
  clearTimeout(vm._scrollStepTimer);
  vm._scrollStepTimer = setTimeout(() => {
    vm[optionKey] = {
      ...vm[optionKey],
      step: vm.$store.state.setting.defaultOption.step,
    };
  }, vm.$store.state.setting.defaultOption.waitTime);
};

export const clearScrollStepTimer = (vm) => {
  clearTimeout(vm._scrollStepTimer);
  vm._scrollStepTimer = null;
};

export const joinRegionName = (
  item,
  keys = ["provinceName", "cityName", "countyName"]
) => keys.map((key) => item[key]).filter(Boolean).join("/");
