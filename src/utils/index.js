export function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export function formatTime(time, fmt) {
  if (!time) {
    return "";
  }

  const date = new Date(time);
  const formatMap = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds(),
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }

  Object.keys(formatMap).forEach((key) => {
    if (new RegExp(`(${key})`).test(fmt)) {
      const value = formatMap[key];
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? value
          : `00${value}`.substr(`${value}`.length)
      );
    }
  });

  return fmt;
}
